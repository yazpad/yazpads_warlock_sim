// Run inside a prepared Forever checkout with -tags=with_db.
// Reads an unmodified IndividualSimSettings export; only supplies a missing encounter.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"

	"github.com/wowsims/forever/sim/common"
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/core/simsignals"
	"github.com/wowsims/forever/sim/warlock"
	"google.golang.org/protobuf/encoding/protojson"
	pb "google.golang.org/protobuf/proto"
)

func raw(message pb.Message) json.RawMessage {
	data, err := (protojson.MarshalOptions{EmitUnpopulated: true}).Marshal(message)
	if err != nil {
		panic(err)
	}
	return data
}

func main() {
	if len(os.Args) != 4 {
		panic("usage: exporter build.json iterations seed")
	}
	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	settings := &proto.IndividualSimSettings{}
	if err := protojson.Unmarshal(data, settings); err != nil {
		panic(err)
	}
	iterations, err := strconv.Atoi(os.Args[2])
	if err != nil || iterations < 2 {
		panic("invalid iterations")
	}
	seed, err := strconv.ParseInt(os.Args[3], 10, 64)
	if err != nil {
		panic(err)
	}
	warlock.RegisterWarlock()
	common.RegisterAllEffects()
	if settings.Player.Equipment == nil {
		settings.Player.Equipment = &proto.EquipmentSpec{}
	}
	encounter := settings.Encounter
	if encounter == nil {
		encounter = core.MakeSingleTargetEncounter(0)
	}
	request := &proto.RaidSimRequest{
		Raid: &proto.Raid{Parties: []*proto.Party{{Players: []*proto.Player{settings.Player}, Buffs: settings.PartyBuffs}},
			Buffs: settings.RaidBuffs, Debuffs: settings.Debuffs, Tanks: settings.Tanks, TargetDummies: settings.TargetDummies},
		Encounter: encounter, SimOptions: &proto.SimOptions{Iterations: int32(iterations), RandomSeed: seed, IsTest: true},
	}
	requestJSON := raw(request)
	sheet := core.ComputeStats(&proto.ComputeStatsRequest{Raid: request.Raid, Encounter: request.Encounter})
	initial := core.NewSim(request, simsignals.CreateSignals())
	initial.Reset()
	player := initial.Raid.Parties[0].Players[0].GetCharacter()
	initialStats := player.GetStats().ToProtoArray()
	result := core.RunRaidSim(request)
	output := map[string]any{"request": requestJSON, "computeStats": raw(sheet), "initialPlayerStats": initialStats, "result": raw(result)}
	encoded, err := json.Marshal(output)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(encoded))
}
