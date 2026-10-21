// Read-only generated spell-row audit, built against the prepared Forever checkout.
package main

import (
	"encoding/json"
	"fmt"
	"github.com/wowsims/forever/sim/core/spelldata"
	_ "github.com/wowsims/forever/sim/warlock"
	"os"
	"strconv"
)

func main() {
	rows := []any{}
	for _, arg := range os.Args[1:] {
		id, err := strconv.ParseInt(arg, 10, 32)
		if err != nil {
			panic(err)
		}
		row := spelldata.MustFind(int32(id))
		effect := row.DamageEffect()
		rows = append(rows, map[string]any{
			"id": id, "name": row.Name, "average": effect.Average(),
			"coefficient": effect.SPCoef, "variance": effect.Variance,
			"directVariance": effect.DirectVariance(), "cost": row.Cost(),
			"cooldownMs": row.CategoryCooldownMs, "row": row,
		})
	}
	data, err := json.Marshal(rows)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
}
