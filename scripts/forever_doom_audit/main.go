// Read-only periodic row/mask audit, built against the prepared Forever checkout.
package main

import (
	"encoding/json"
	"fmt"
	"github.com/wowsims/forever/sim/common"
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/core/simsignals"
	"github.com/wowsims/forever/sim/core/spelldata"
	"github.com/wowsims/forever/sim/warlock"
	"google.golang.org/protobuf/encoding/protojson"
	"os"
)

func main() {
	doom := spelldata.MustFind(603)
	tick := doom.PeriodicEffect()
	wrack := spelldata.MustFind(1316697)
	flags := wrack.EffectN(2).ClassFlags
	out := map[string]any{
		"doom": doom, "average": tick.Average(), "coefficient": tick.SPCoef,
		"variance": tick.Variance, "periodMs": tick.PeriodMs,
		"durationMs": doom.DurationMs, "cooldownMs": doom.CooldownMs,
		"periodicCanCrit":  doom.PeriodicCanCrit(),
		"wrackDamageFlags": flags, "doomFlags": doom.ClassFlags,
		"wrackAffectsDoom": doom.ClassFlags.Matches(flags),
	}
	if len(os.Args) > 1 {
		warlock.RegisterWarlock()
		common.RegisterAllEffects()
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
		for _, spell := range owner.Spellbook {
			if spell.SpellID == 603 {
				out["expectedCritChance"] = spell.SpellCritChance(sim.Encounter.AllTargetUnits[0])
			}
		}
	}
	data, err := json.Marshal(out)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
}
