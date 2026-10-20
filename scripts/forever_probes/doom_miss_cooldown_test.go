package warlock

import (
	"github.com/wowsims/forever/sim/core"
	"github.com/wowsims/forever/sim/core/proto"
	"github.com/wowsims/forever/sim/core/stats"
	"testing"
	"time"
)

// A real failed Doom application still starts its 60-second cooldown.
func TestParityProbeDoomMissCooldown(t *testing.T) {
	encounter := core.MakeSingleTargetEncounter(0)
	encounter.Duration = 130
	sim, w := newWarlockSim("", &proto.WarlockOptions{CurseOptions: proto.WarlockOptions_NoCurse}, encounter)
	target := sim.Encounter.AllTargetUnits[0]
	w.AddStatsDynamic(sim, stats.Stats{stats.SpellHitPercent: -100})
	if !w.BaneOfDoom.Cast(sim, target) {
		t.Fatal("initial cast rejected")
	}
	if w.BaneOfDoom.Dot(target).IsActive() {
		t.Fatal("expected forced miss")
	}
	if w.BaneOfDoom.SpellMetrics[target.UnitIndex].Misses != 1 {
		t.Fatal("expected one recorded miss")
	}
	if got := w.BaneOfDoom.TimeToReady(sim); got != 60*time.Second {
		t.Fatalf("after miss: cooldown %v, want 60s", got)
	}
	until := func(at time.Duration) {
		reached := false
		sim.AddPendingAction(&core.PendingAction{NextActionAt: at, OnAction: func(*core.Simulation) { reached = true }})
		for !reached {
			if sim.Step() {
				t.Fatalf("sim ended before %v", at)
			}
		}
	}
	until(1500 * time.Millisecond)
	if w.BaneOfDoom.CanCast(sim, target) {
		t.Fatal("Doom can retry at 1.5s despite cooldown")
	}
	until(60 * time.Second)
	if !w.BaneOfDoom.CanCast(sim, target) {
		t.Fatal("Doom not ready at 60s")
	}
	if !w.BaneOfDoom.Cast(sim, target) {
		t.Fatal("second cast rejected at 60s")
	}
	t.Log("Doom missed at 0s; unavailable at 1.5s; available and cast at 60s")
}
