// Run from a Forever checkout: go run -tags=with_db /path/to/this/main.go [preset] [race]
// Uses SettingsCombos with explicit gear-free inputs from the shared scenario.
package main

import (
	"encoding/json"
	"fmt"
	"github.com/wowsims/forever/sim/common"
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/core/simsignals"
	"github.com/wowsims/forever/sim/core/stats"
	"github.com/wowsims/forever/sim/warlock"
	"google.golang.org/protobuf/encoding/protojson"
	pb "google.golang.org/protobuf/proto"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
)

func raw(p pb.Message) json.RawMessage {
	b, err := protojson.MarshalOptions{EmitUnpopulated: true}.Marshal(p)
	if err != nil {
		panic(err)
	}
	return b
}

func named(s stats.Stats) map[string]float64 {
	out := map[string]float64{}
	for i, v := range s {
		out[stats.Stat(i).StatName()] = v
	}
	return out
}

func main() {
	warlock.RegisterWarlock()
	common.RegisterAllEffects()
	preset := "sm_ruin"
	if len(os.Args) > 1 {
		preset = os.Args[1]
	}
	label := map[string]string{"sm_ruin": "Affliction", "aff_wrack": "Wrack", "destro": "Destruction", "demo_fire_brand": "Fire Brand", "demo_shadow_brand": "Shadow Brand"}[preset]
	if label == "" {
		panic("unknown preset")
	}
	build := core.GetTestBuildFromJSON(proto.Class_ClassWarlock, "ui/specs/warlock/dps/builds", preset, core.ItemFilter{}, nil, nil)
	race := map[string]proto.Race{"sm_ruin": proto.Race_RaceHuman, "aff_wrack": proto.Race_RaceOrc, "destro": proto.Race_RaceGnome, "demo_fire_brand": proto.Race_RaceHuman, "demo_shadow_brand": proto.Race_RaceHuman}[preset]
	if len(os.Args) > 2 {
		n, ok := proto.Race_value[os.Args[2]]
		if !ok {
			panic("unknown race")
		}
		race = proto.Race(n)
	}
	combos := &core.SettingsCombos{
		Class: proto.Class_ClassWarlock, Races: []proto.Race{race},
		GearSets:     []core.GearSetCombo{{Label: "gear-free", GearSet: &proto.EquipmentSpec{}}},
		TalentSets:   []core.TalentsCombo{{Label: "DefaultTalents", Talents: build.Talents}},
		SpecOptions:  []core.SpecOptionsCombo{{Label: label, SpecOptions: build.SpecOptions.SpecOptions}},
		Rotations:    []core.RotationCombo{{Label: preset, Rotation: build.Rotation.Rotation}},
		ItemSwapSets: []core.ItemSwapSetCombo{{}},
		Buffs:        []core.BuffsCombo{{Label: "ExternalCoEOnly", Raid: &proto.RaidBuffs{}, Party: &proto.PartyBuffs{}, Player: &proto.IndividualBuffs{}, Debuffs: &proto.Debuffs{}}},
		Encounters:   core.MakeDefaultEncounterCombos(), SimOptions: core.DefaultSimTestOptions, StartingDistances: []float64{0},
	}
	for i := 0; i < combos.NumTests(); i++ {
		name, _, _, request := combos.GetTest(i)
		if request.Encounter.Duration != 180 || len(request.Encounter.Targets) != 1 {
			continue
		}
		_, sourceFile, _, _ := runtime.Caller(0)
		scenarioPath := filepath.Join(filepath.Dir(sourceFile), "../../fixtures/forever_gear_free_scenario.json")
		// Optional scenario file allows reproducible race/stat sweeps without changing the baseline.
		if len(os.Args) > 5 {
			scenarioPath = os.Args[5]
		}
		var scenario struct {
			ScenarioID      string             `json:"scenarioId"`
			BonusStats      map[string]float64 `json:"bonusStats"`
			ExternalDebuffs struct {
				CurseOfElements bool `json:"curseOfElements"`
			} `json:"externalDebuffs"`
		}
		data, err := os.ReadFile(scenarioPath)
		if err != nil {
			panic(err)
		}
		if err := json.Unmarshal(data, &scenario); err != nil {
			panic(err)
		}
		bonus := stats.Stats{}
		fields := map[string]stats.Stat{"spellPower": stats.SpellDamage, "shadowPower": stats.ShadowDamage, "firePower": stats.FireDamage, "intellect": stats.Intellect, "stamina": stats.Stamina, "spirit": stats.Spirit, "mp5": stats.MP5, "penetration": stats.SpellPiercing}
		for key, value := range scenario.BonusStats {
			if key == "hit" || key == "crit" {
				continue
			}
			stat, ok := fields[key]
			if !ok {
				panic("unsupported bonus stat: " + key)
			}
			bonus[stat] = value
		}
		pseudo := make([]float64, stats.PseudoStatsLen)
		pseudo[proto.PseudoStat_PseudoStatSpellHitPercent] = scenario.BonusStats["hit"]
		pseudo[proto.PseudoStat_PseudoStatSpellCritPercent] = scenario.BonusStats["crit"]
		request.Raid.Parties[0].Players[0].BonusStats = &proto.UnitStats{Stats: bonus.ToProtoArray(), PseudoStats: pseudo}
		request.Raid.Parties[0].Players[0].GetWarlock().Options.ClassOptions.Armor = proto.WarlockOptions_NoArmor
		request.Raid.Debuffs.CurseOfElements = scenario.ExternalDebuffs.CurseOfElements
		if scenario.ExternalDebuffs.CurseOfElements {
			request.Raid.Parties[0].Players[0].GetWarlock().Options.ClassOptions.CurseOptions = proto.WarlockOptions_NoCurse
		}
		request.SimOptions = pb.Clone(request.SimOptions).(*proto.SimOptions)
		if len(os.Args) > 3 {
			iterations, err := strconv.Atoi(os.Args[3])
			if err != nil || iterations < 1 || iterations > 1000000 {
				panic("iterations must be between 1 and 1000000")
			}
			request.SimOptions.Iterations = int32(iterations)
		}
		if len(os.Args) > 4 {
			seed, err := strconv.ParseInt(os.Args[4], 10, 64)
			if err != nil {
				panic(err)
			}
			request.SimOptions.RandomSeed = seed
		}
		requestJSON := raw(request)
		sheet := core.ComputeStats(&proto.ComputeStatsRequest{Raid: request.Raid, Encounter: request.Encounter})
		sim := core.NewSim(request, simsignals.CreateSignals())
		sim.Reset()
		player := sim.Raid.Parties[0].Players[0].GetCharacter()
		pets := []any{}
		for _, pet := range player.Pets {
			pets = append(pets, map[string]any{"name": pet.Label, "enabled": pet.IsEnabled(), "stats": named(pet.GetStats()), "pseudoStats": pet.PseudoStats})
		}
		gearItems := []any{}
		for _, spec := range request.Raid.Parties[0].Players[0].Equipment.Items {
			if spec.Id == 0 {
				gearItems = append(gearItems, nil)
				continue
			}
			item := core.NewItem(core.ItemSpec{ID: spec.Id})
			gearItems = append(gearItems, map[string]any{"id": item.ID, "name": item.Name, "stats": named(item.Stats), "setName": item.SetName, "quality": item.Quality.String(), "eligibleSlots": core.EligibleSlotsForItem(&item)})
		}
		result := core.RunRaidSim(request)
		output := map[string]any{"schemaVersion": 2, "presetId": preset, "testName": "Settings-" + name, "request": requestJSON, "computeStats": raw(sheet), "basePlayerStats": named(player.GetBaseStats()), "gearItems": gearItems, "initialPlayerStats": named(player.GetStats()), "initialPlayerPseudoStats": player.PseudoStats, "initialPets": pets, "result": raw(result)}
		output["ratingConversions"] = map[string]float64{"hitRatingPerPercent": core.HitRatingPerHitPercent, "critRatingPerPercent": core.CritRatingPerCritPercent}
		output["scenarioId"] = scenario.ScenarioID
		output["declaredBonusStats"] = scenario.BonusStats
		encoded, err := json.MarshalIndent(output, "", "  ")
		if err != nil {
			panic(err)
		}
		fmt.Println(string(encoded))
		return
	}
	panic("matching benchmark request not found")
}
