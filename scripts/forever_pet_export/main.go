package main

import (
	"encoding/json"
	"fmt"
	"github.com/wowsims/forever/sim/common"
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/core/simsignals"
	"github.com/wowsims/forever/sim/core/spelldata"
	"github.com/wowsims/forever/sim/core/stats"
	"github.com/wowsims/forever/sim/warlock"
	"google.golang.org/protobuf/encoding/protojson"
	"os"
)

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
	if len(os.Args) != 2 {
		panic("Expected a RaidSimRequest JSON path or audit")
	}
	if os.Args[1] == "audit" {
		rows := []any{}
		for _, id := range []int32{11763, 11780} {
			s := spelldata.MustFind(id)
			e := s.DamageEffect()
			rows = append(rows, map[string]any{"id": id, "name": s.Name, "cost": s.Cost(), "castTimeMs": s.CastTimeMs, "cooldownMs": s.CategoryCooldownMs, "average": e.Average(), "coefficient": e.SPCoef, "variance": e.Variance})
		}
		b, _ := json.MarshalIndent(map[string]any{"spells": rows, "creatureAutoAttackDps": core.CreatureAutoAttackDpsMaxLevel, "petUpdateIntervalNs": core.PetUpdateInterval}, "", "  ")
		fmt.Println(string(b))
		return
	}
	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	request := &proto.RaidSimRequest{}
	if err = protojson.Unmarshal(data, request); err != nil {
		panic(err)
	}
	sim := core.NewSim(request, simsignals.CreateSignals())
	sim.Reset()
	owner := sim.Raid.Parties[0].Players[0].GetCharacter()
	pets := []any{}
	for _, p := range owner.Pets {
		pets = append(pets, map[string]any{"name": p.Label, "enabled": p.IsEnabled(), "stats": named(p.GetStats())})
	}
	result := core.RunRaidSim(request)
	raw, err := (protojson.MarshalOptions{EmitUnpopulated: true}).Marshal(result)
	if err != nil {
		panic(err)
	}
	out := map[string]any{"initialPlayerStats": named(owner.GetStats()), "initialPets": pets, "result": json.RawMessage(raw)}
	data, err = json.Marshal(out)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
}
