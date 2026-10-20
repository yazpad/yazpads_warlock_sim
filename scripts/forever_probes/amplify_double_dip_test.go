package warlock

import (
 "math"
 "testing"
 "time"

 "github.com/wowsims/forever/sim/core"
 "github.com/wowsims/forever/sim/core/proto"
 "github.com/wowsims/forever/sim/core/stats"
)

// Characterizes current Forever behavior, not the intended next-curse rule.
// Run against an isolated Forever checkout using the companion runner.
func TestParityProbeAmplifyDoubleDip(t *testing.T) {
 type capture struct { first, second, secondAfterExpiry, third float64; activeAfterFirst, activeAtSecond, activeAfterExpiry bool }
 run := func(amplify bool) capture {
  encounter := core.MakeSingleTargetEncounter(0)
  encounter.Duration = 60
  sim, w := newWarlockSim("000000001", &proto.WarlockOptions{CurseOptions: proto.WarlockOptions_NoCurse}, encounter)
  target := sim.Encounter.AllTargetUnits[0]
  w.AddStatsDynamic(sim, stats.Stats{stats.SpellDamage: 300, stats.SpellHitPercent: 100})
  until := func(at time.Duration) {
   reached := false
   sim.AddPendingAction(&core.PendingAction{NextActionAt: at, OnAction: func(*core.Simulation) { reached = true }})
   for !reached { if sim.Step() { t.Fatalf("sim ended before %v", at) } }
  }
  cast := func(spell *core.Spell) { if !spell.Cast(sim, target) { t.Fatalf("cast failed at %v: %v", sim.CurrentTime, spell.ActionID) } }
  if amplify { cast(w.AmplifyCurse) }
  cast(w.BaneOfAgony)
  out := capture{activeAfterFirst: w.AmplifyCurseAura.IsActive()}
  until(2*time.Second + time.Nanosecond)
  out.first = w.BaneOfAgony.Dot(target).SnapshotBaseDamage
  // Let the first 24-second Agony finish before the second application.
  until(24100*time.Millisecond)
  out.activeAtSecond = w.AmplifyCurseAura.IsActive()
  cast(w.BaneOfAgony)
  until(26100*time.Millisecond + time.Nanosecond)
  out.second = w.BaneOfAgony.Dot(target).SnapshotBaseDamage
  // Fourth tick of cast two: still in the first ramp tier, after aura expiry.
  until(32100*time.Millisecond + time.Nanosecond)
  out.secondAfterExpiry = w.BaneOfAgony.Dot(target).SnapshotBaseDamage
  out.activeAfterExpiry = w.AmplifyCurseAura.IsActive()
  until(34*time.Second)
  cast(w.BaneOfAgony)
  until(36*time.Second + time.Nanosecond)
  out.third = w.BaneOfAgony.Dot(target).SnapshotBaseDamage
  if amplify && w.AmplifyCurse.SpellMetrics[target.UnitIndex].Casts != 1 { t.Fatal("expected exactly one real Amplify cast") }
  return out
 }
 plain, boosted := run(false), run(true)
 check := func(label string, got, want float64) { t.Helper(); if math.Abs(got-want)>1e-6 { t.Errorf("%s: got %.9f, want %.9f",label,got,want) } }
 check("first cast", boosted.first/plain.first, 1.5)
 check("second cast before expiry", boosted.second/plain.second, 1.5)
 check("second cast tick after expiry", boosted.secondAfterExpiry/plain.secondAfterExpiry, 1.5)
 check("third cast after expiry", boosted.third/plain.third, 1)
 if !boosted.activeAfterFirst || !boosted.activeAtSecond || boosted.activeAfterExpiry { t.Errorf("unexpected aura states: %+v",boosted) }
 t.Logf("unamplified snapshot bases: first=%.3f second=%.3f second-after-expiry=%.3f third=%.3f",plain.first,plain.second,plain.secondAfterExpiry,plain.third)
 t.Logf("one Amplify cast: first=%.3f (%.2fx), second=%.3f (%.2fx), second-after-expiry=%.3f (%.2fx), third=%.3f (%.2fx)",boosted.first,boosted.first/plain.first,boosted.second,boosted.second/plain.second,boosted.secondAfterExpiry,boosted.secondAfterExpiry/plain.secondAfterExpiry,boosted.third,boosted.third/plain.third)
 t.Logf("aura active after first=%v, at second=%v, after expiry=%v",boosted.activeAfterFirst,boosted.activeAtSecond,boosted.activeAfterExpiry)
}
