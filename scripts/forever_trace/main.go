package main

import (
	"fmt"
	"github.com/wowsims/forever/sim/common"
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/warlock"
	"google.golang.org/protobuf/encoding/protojson"
	"os"
)

func main() {
	warlock.RegisterWarlock()
	common.RegisterAllEffects()
	b, e := os.ReadFile(os.Args[1])
	if e != nil {
		panic(e)
	}
	r := &proto.RaidSimRequest{}
	if e = protojson.Unmarshal(b, r); e != nil {
		panic(e)
	}
	r.SimOptions.Debug = true
	r.SimOptions.Iterations = 1
	out := core.RunRaidSim(r)
	b, e = protojson.Marshal(out)
	if e != nil {
		panic(e)
	}
	fmt.Println(string(b))
}
