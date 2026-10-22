// Unmodified Forever warlock default exports.
// Source revision: 86d0920cae8445eaa90de9c17c3583cf171c19c5.
export const FOREVER_PRESETS = Object.freeze([
  {
    "id": "forever-demo_fire_brand",
    "name": "Demo (Fire Brand) (Forever)",
    "build": {
      "apiVersion": 2,
      "raidBuffs": {
        "arcaneBrilliance": true,
        "giftOfTheWild": true,
        "prayerOfFortitude": true,
        "prayerOfSpirit": true,
        "moonkinAura": true
      },
      "partyBuffs": {
        "manaSpringTotem": "TristateEffectRegular"
      },
      "debuffs": {
        "judgementOfWisdom": true,
        "sunderArmor": true,
        "faerieFire": true,
        "giftOfArthas": true,
        "exposeArmor": true
      },
      "player": {
        "apiVersion": 2,
        "name": "Player",
        "race": "RaceOrc",
        "class": "ClassWarlock",
        "consumables": {
          "flaskId": 13512,
          "foodId": 13931,
          "conjuredId": 12662,
          "mhImbueId": 20749,
          "offensivePotId": 250937,
          "explosiveId": 18588
        },
        "buffs": {
          "greaterBlessingOfKings": true,
          "greaterBlessingOfWisdom": true
        },
        "warlock": {
          "options": {
            "classOptions": {
              "summon": "Imp",
              "armor": "DemonArmor",
              "curseOptions": "Elements",
              "sacrificedDemon": "Succubus"
            }
          }
        },
        "talentsString": "011-0305003201220301351-0050055003",
        "profession1": "Engineering",
        "profession2": "Tailoring",
        "rotation": {
          "type": "TypeAPL",
          "priorityList": [
            {
              "action": {
                "autocastOtherCooldowns": {}
              }
            },
            {
              "action": {
                "condition": {
                  "or": {
                    "vals": [
                      {
                        "and": {
                          "vals": [
                            {
                              "dotIsActive": {
                                "spellId": {
                                  "spellId": 603
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLe",
                                "lhs": {
                                  "dotRemainingTime": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Boost window"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        "and": {
                          "vals": [
                            {
                              "not": {
                                "val": {
                                  "dotIsActive": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLt",
                                "lhs": {
                                  "remainingTime": {}
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Doom tick"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 603
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "variableRef": {
                              "name": "In execute"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Split Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpGe",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 603
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "auraIsActive": {
                        "sourceUnit": {
                          "type": "CurrentTarget"
                        },
                        "auraId": {
                          "spellId": 1293696
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 17923
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 11713
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpLt",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11713
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25309
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25309
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "warlockAssignedCurseIsActive": {}
                    }
                  }
                },
                "castWarlockAssignedCurse": {}
              }
            },
            {
              "action": {
                "condition": {
                  "cmp": {
                    "op": "OpLt",
                    "lhs": {
                      "currentMana": {
                        "sourceUnit": {
                          "type": "Pet",
                          "index": 0,
                          "owner": {
                            "type": "Self"
                          }
                        }
                      }
                    },
                    "rhs": {
                      "variableRef": {
                        "name": "Firebolt cost"
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 440873
                    }
                  }
                },
                "groupReference": {
                  "groupName": "Split Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 440873
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 17924
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25311
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 17923
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "name": "Boosts",
              "actions": [
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "spellId": 20572
                      }
                    }
                  }
                },
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "itemId": 250937
                      }
                    }
                  }
                }
              ]
            },
            {
              "name": "Split Boosts",
              "actions": [
                {
                  "action": {
                    "condition": {
                      "or": {
                        "vals": [
                          {
                            "variableRef": {
                              "name": "In execute"
                            }
                          },
                          {
                            "cmp": {
                              "op": "OpGe",
                              "lhs": {
                                "variableRef": {
                                  "name": "Time to execute"
                                }
                              },
                              "rhs": {
                                "const": {
                                  "val": "3m"
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "castSpell": {
                      "spellId": {
                        "spellId": 20554
                      }
                    }
                  }
                },
                {
                  "action": {
                    "condition": {
                      "or": {
                        "vals": [
                          {
                            "variableRef": {
                              "name": "In execute"
                            }
                          },
                          {
                            "cmp": {
                              "op": "OpGe",
                              "lhs": {
                                "variableRef": {
                                  "name": "Time to execute"
                                }
                              },
                              "rhs": {
                                "const": {
                                  "val": "2m"
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "castSpell": {
                      "spellId": {
                        "spellId": 1259821
                      }
                    }
                  }
                }
              ]
            }
          ],
          "valueVariables": [
            {
              "name": "Execute at",
              "value": {
                "const": {
                  "val": "35%"
                }
              }
            },
            {
              "name": "Time to execute",
              "value": {
                "math": {
                  "op": "OpSub",
                  "lhs": {
                    "remainingTime": {}
                  },
                  "rhs": {
                    "math": {
                      "op": "OpMul",
                      "lhs": {
                        "math": {
                          "op": "OpAdd",
                          "lhs": {
                            "currentTime": {}
                          },
                          "rhs": {
                            "remainingTime": {}
                          }
                        }
                      },
                      "rhs": {
                        "variableRef": {
                          "name": "Execute at"
                        }
                      }
                    }
                  }
                }
              }
            },
            {
              "name": "In execute",
              "value": {
                "cmp": {
                  "op": "OpLe",
                  "lhs": {
                    "variableRef": {
                      "name": "Time to execute"
                    }
                  },
                  "rhs": {
                    "const": {
                      "val": "0s"
                    }
                  }
                }
              }
            },
            {
              "name": "Doom tick",
              "value": {
                "const": {
                  "val": "60s"
                }
              }
            },
            {
              "name": "Boost window",
              "value": {
                "const": {
                  "val": "14s"
                }
              }
            },
            {
              "name": "Firebolt cost",
              "value": {
                "const": {
                  "val": "115"
                }
              }
            }
          ]
        },
        "distanceFromTarget": 20
      }
    }
  },
  {
    "id": "forever-demo_shadow_brand",
    "name": "Demo (Shadow Brand) (Forever)",
    "build": {
      "apiVersion": 2,
      "raidBuffs": {
        "arcaneBrilliance": true,
        "giftOfTheWild": true,
        "prayerOfFortitude": true,
        "prayerOfSpirit": true,
        "moonkinAura": true
      },
      "partyBuffs": {
        "manaSpringTotem": "TristateEffectRegular"
      },
      "debuffs": {
        "judgementOfWisdom": true,
        "sunderArmor": true,
        "faerieFire": true,
        "giftOfArthas": true,
        "exposeArmor": true
      },
      "player": {
        "apiVersion": 2,
        "name": "Player",
        "race": "RaceOrc",
        "class": "ClassWarlock",
        "consumables": {
          "flaskId": 13512,
          "foodId": 13931,
          "conjuredId": 12662,
          "mhImbueId": 20749,
          "offensivePotId": 250937,
          "explosiveId": 18588
        },
        "buffs": {
          "greaterBlessingOfKings": true,
          "greaterBlessingOfWisdom": true
        },
        "warlock": {
          "options": {
            "classOptions": {
              "summon": "Succubus",
              "armor": "DemonArmor",
              "curseOptions": "Elements",
              "sacrificedDemon": "Imp"
            }
          }
        },
        "talentsString": "011-0005003231220301351-0550005003",
        "profession1": "Engineering",
        "profession2": "Tailoring",
        "rotation": {
          "type": "TypeAPL",
          "priorityList": [
            {
              "action": {
                "autocastOtherCooldowns": {}
              }
            },
            {
              "action": {
                "condition": {
                  "or": {
                    "vals": [
                      {
                        "and": {
                          "vals": [
                            {
                              "dotIsActive": {
                                "spellId": {
                                  "spellId": 603
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLe",
                                "lhs": {
                                  "dotRemainingTime": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Boost window"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        "and": {
                          "vals": [
                            {
                              "not": {
                                "val": {
                                  "dotIsActive": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLt",
                                "lhs": {
                                  "remainingTime": {}
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Doom tick"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 603
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "variableRef": {
                              "name": "In execute"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Split Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpGe",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 603
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "auraIsActive": {
                        "sourceUnit": {
                          "type": "CurrentTarget"
                        },
                        "auraId": {
                          "spellId": 1293696
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 17923
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 11713
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpLt",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11713
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25309
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25309
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "warlockAssignedCurseIsActive": {}
                    }
                  }
                },
                "castWarlockAssignedCurse": {}
              }
            },
            {
              "action": {
                "condition": {
                  "cmp": {
                    "op": "OpLt",
                    "lhs": {
                      "currentMana": {
                        "sourceUnit": {
                          "type": "Pet",
                          "index": 2,
                          "owner": {
                            "type": "Self"
                          }
                        }
                      }
                    },
                    "rhs": {
                      "variableRef": {
                        "name": "Lash of Pain cost"
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 440873
                    }
                  }
                },
                "groupReference": {
                  "groupName": "Split Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 440873
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 17924
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25311
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "name": "Boosts",
              "actions": [
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "spellId": 20572
                      }
                    }
                  }
                },
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "itemId": 250937
                      }
                    }
                  }
                }
              ]
            },
            {
              "name": "Split Boosts",
              "actions": [
                {
                  "action": {
                    "condition": {
                      "or": {
                        "vals": [
                          {
                            "variableRef": {
                              "name": "In execute"
                            }
                          },
                          {
                            "cmp": {
                              "op": "OpGe",
                              "lhs": {
                                "variableRef": {
                                  "name": "Time to execute"
                                }
                              },
                              "rhs": {
                                "const": {
                                  "val": "3m"
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "castSpell": {
                      "spellId": {
                        "spellId": 20554
                      }
                    }
                  }
                },
                {
                  "action": {
                    "condition": {
                      "or": {
                        "vals": [
                          {
                            "variableRef": {
                              "name": "In execute"
                            }
                          },
                          {
                            "cmp": {
                              "op": "OpGe",
                              "lhs": {
                                "variableRef": {
                                  "name": "Time to execute"
                                }
                              },
                              "rhs": {
                                "const": {
                                  "val": "2m"
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "castSpell": {
                      "spellId": {
                        "spellId": 1259821
                      }
                    }
                  }
                }
              ]
            }
          ],
          "valueVariables": [
            {
              "name": "Execute at",
              "value": {
                "const": {
                  "val": "35%"
                }
              }
            },
            {
              "name": "Time to execute",
              "value": {
                "math": {
                  "op": "OpSub",
                  "lhs": {
                    "remainingTime": {}
                  },
                  "rhs": {
                    "math": {
                      "op": "OpMul",
                      "lhs": {
                        "math": {
                          "op": "OpAdd",
                          "lhs": {
                            "currentTime": {}
                          },
                          "rhs": {
                            "remainingTime": {}
                          }
                        }
                      },
                      "rhs": {
                        "variableRef": {
                          "name": "Execute at"
                        }
                      }
                    }
                  }
                }
              }
            },
            {
              "name": "In execute",
              "value": {
                "cmp": {
                  "op": "OpLe",
                  "lhs": {
                    "variableRef": {
                      "name": "Time to execute"
                    }
                  },
                  "rhs": {
                    "const": {
                      "val": "0s"
                    }
                  }
                }
              }
            },
            {
              "name": "Doom tick",
              "value": {
                "const": {
                  "val": "60s"
                }
              }
            },
            {
              "name": "Boost window",
              "value": {
                "const": {
                  "val": "14s"
                }
              }
            },
            {
              "name": "Lash of Pain cost",
              "value": {
                "const": {
                  "val": "160"
                }
              }
            }
          ]
        },
        "distanceFromTarget": 20
      }
    }
  },
  {
    "id": "forever-destro",
    "name": "Destro (Forever)",
    "build": {
      "apiVersion": 2,
      "raidBuffs": {
        "arcaneBrilliance": true,
        "giftOfTheWild": true,
        "prayerOfFortitude": true,
        "prayerOfSpirit": true,
        "moonkinAura": true
      },
      "partyBuffs": {
        "manaSpringTotem": "TristateEffectRegular"
      },
      "debuffs": {
        "judgementOfWisdom": true,
        "sunderArmor": true,
        "faerieFire": true,
        "giftOfArthas": true,
        "exposeArmor": true
      },
      "player": {
        "apiVersion": 2,
        "name": "Player",
        "race": "RaceOrc",
        "class": "ClassWarlock",
        "consumables": {
          "flaskId": 13512,
          "foodId": 13931,
          "conjuredId": 12662,
          "mhImbueId": 20749,
          "offensivePotId": 250937,
          "explosiveId": 18588
        },
        "buffs": {
          "greaterBlessingOfKings": true,
          "greaterBlessingOfWisdom": true
        },
        "warlock": {
          "options": {
            "classOptions": {
              "summon": "Succubus",
              "armor": "DemonArmor",
              "curseOptions": "Elements",
            }
          }
        },
        "talentsString": "2530000013-0004-0050355103101351",
        "profession1": "Engineering",
        "profession2": "Tailoring",
        "rotation": {
          "type": "TypeAPL",
          "priorityList": [
            {
              "action": {
                "autocastOtherCooldowns": {}
              }
            },
            {
              "action": {
                "condition": {
                  "or": {
                    "vals": [
                      {
                        "and": {
                          "vals": [
                            {
                              "dotIsActive": {
                                "spellId": {
                                  "spellId": 603
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLe",
                                "lhs": {
                                  "dotRemainingTime": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Boost window"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        "and": {
                          "vals": [
                            {
                              "not": {
                                "val": {
                                  "dotIsActive": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLt",
                                "lhs": {
                                  "remainingTime": {}
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Doom tick"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpGe",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 603
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 11713
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpLt",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11713
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "warlockAssignedCurseIsActive": {}
                    }
                  }
                },
                "castWarlockAssignedCurse": {}
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25309
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25309
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25311
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "dotIsActive": {
                    "spellId": {
                      "spellId": 25309
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 18932
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 18871
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 1293813
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "name": "Boosts",
              "actions": [
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "spellId": 20572
                      }
                    }
                  }
                },
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "itemId": 250937
                      }
                    }
                  }
                }
              ]
            }
          ],
          "valueVariables": [
            {
              "name": "Doom tick",
              "value": {
                "const": {
                  "val": "60s"
                }
              }
            },
            {
              "name": "Boost window",
              "value": {
                "const": {
                  "val": "14s"
                }
              }
            }
          ]
        },
        "distanceFromTarget": 20
      }
    }
  },
  {
    "id": "forever-sm_ruin",
    "name": "SM/Ruin (Forever)",
    "build": {
      "apiVersion": 2,
      "raidBuffs": {
        "arcaneBrilliance": true,
        "giftOfTheWild": true,
        "prayerOfFortitude": true,
        "prayerOfSpirit": true,
        "moonkinAura": true
      },
      "partyBuffs": {
        "manaSpringTotem": "TristateEffectRegular"
      },
      "debuffs": {
        "judgementOfWisdom": true,
        "sunderArmor": true,
        "faerieFire": true,
        "giftOfArthas": true,
        "exposeArmor": true
      },
      "player": {
        "apiVersion": 2,
        "name": "Player",
        "race": "RaceOrc",
        "class": "ClassWarlock",
        "consumables": {
          "flaskId": 13512,
          "foodId": 13931,
          "conjuredId": 12662,
          "mhImbueId": 20749,
          "offensivePotId": 250937,
          "explosiveId": 18588
        },
        "buffs": {
          "greaterBlessingOfKings": true,
          "greaterBlessingOfWisdom": true
        },
        "warlock": {
          "options": {
            "classOptions": {
              "summon": "Succubus",
              "armor": "DemonArmor",
              "curseOptions": "Elements",
            }
          }
        },
        "talentsString": "2540002013520105--0550305003",
        "profession1": "Engineering",
        "profession2": "Tailoring",
        "rotation": {
          "type": "TypeAPL",
          "priorityList": [
            {
              "action": {
                "autocastOtherCooldowns": {}
              }
            },
            {
              "action": {
                "condition": {
                  "or": {
                    "vals": [
                      {
                        "and": {
                          "vals": [
                            {
                              "dotIsActive": {
                                "spellId": {
                                  "spellId": 603
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLe",
                                "lhs": {
                                  "dotRemainingTime": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Boost window"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        "and": {
                          "vals": [
                            {
                              "not": {
                                "val": {
                                  "dotIsActive": {
                                    "spellId": {
                                      "spellId": 603
                                    }
                                  }
                                }
                              }
                            },
                            {
                              "cmp": {
                                "op": "OpLt",
                                "lhs": {
                                  "remainingTime": {}
                                },
                                "rhs": {
                                  "variableRef": {
                                    "name": "Doom tick"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                "groupReference": {
                  "groupName": "Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "variableRef": {
                          "name": "Agony time"
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "auraIsActive": {
                              "auraId": {
                                "spellId": 18288
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 18288
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 603
                              }
                            }
                          }
                        }
                      },
                      {
                        "cmp": {
                          "op": "OpGe",
                          "lhs": {
                            "remainingTime": {}
                          },
                          "rhs": {
                            "variableRef": {
                              "name": "Doom tick"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 603
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "variableRef": {
                    "name": "Agony time"
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11713
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25311
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 17941
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 18881
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 18881
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "warlockAssignedCurseIsActive": {}
                    }
                  }
                },
                "castWarlockAssignedCurse": {}
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25309
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25309
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "name": "Boosts",
              "actions": [
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "spellId": 20572
                      }
                    }
                  }
                },
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "itemId": 250937
                      }
                    }
                  }
                }
              ]
            }
          ],
          "valueVariables": [
            {
              "name": "Doom tick",
              "value": {
                "const": {
                  "val": "60s"
                }
              }
            },
            {
              "name": "Boost window",
              "value": {
                "const": {
                  "val": "14s"
                }
              }
            },
            {
              "name": "Agony time",
              "value": {
                "and": {
                  "vals": [
                    {
                      "not": {
                        "val": {
                          "dotIsActive": {
                            "spellId": {
                              "spellId": 603
                            }
                          }
                        }
                      }
                    },
                    {
                      "not": {
                        "val": {
                          "dotIsActive": {
                            "spellId": {
                              "spellId": 11713
                            }
                          }
                        }
                      }
                    },
                    {
                      "cmp": {
                        "op": "OpLt",
                        "lhs": {
                          "remainingTime": {}
                        },
                        "rhs": {
                          "variableRef": {
                            "name": "Doom tick"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        },
        "distanceFromTarget": 20
      }
    }
  },
  {
    "id": "forever-aff_wrack",
    "name": "Aff (Wrack) (Forever)",
    "build": {
      "apiVersion": 2,
      "raidBuffs": {
        "arcaneBrilliance": true,
        "giftOfTheWild": true,
        "prayerOfFortitude": true,
        "prayerOfSpirit": true,
        "moonkinAura": true
      },
      "partyBuffs": {
        "manaSpringTotem": "TristateEffectRegular"
      },
      "debuffs": {
        "judgementOfWisdom": true,
        "sunderArmor": true,
        "faerieFire": true,
        "giftOfArthas": true,
        "exposeArmor": true
      },
      "player": {
        "apiVersion": 2,
        "name": "Player",
        "race": "RaceOrc",
        "class": "ClassWarlock",
        "consumables": {
          "flaskId": 13512,
          "foodId": 13931,
          "conjuredId": 12662,
          "mhImbueId": 20749,
          "offensivePotId": 250937,
          "explosiveId": 18588
        },
        "buffs": {
          "greaterBlessingOfKings": true,
          "greaterBlessingOfWisdom": true
        },
        "warlock": {
          "options": {
            "classOptions": {
              "summon": "Succubus",
              "armor": "DemonArmor",
              "curseOptions": "Elements",
            }
          }
        },
        "talentsString": "25300020135201351--0550005003",
        "profession1": "Engineering",
        "profession2": "Tailoring",
        "rotation": {
          "type": "TypeAPL",
          "priorityList": [
            {
              "action": {
                "autocastOtherCooldowns": {}
              }
            },
            {
              "action": {
                "groupReference": {
                  "groupName": "Boosts"
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "not": {
                          "val": {
                            "dotIsActive": {
                              "spellId": {
                                "spellId": 11713
                              }
                            }
                          }
                        }
                      },
                      {
                        "not": {
                          "val": {
                            "auraIsActive": {
                              "auraId": {
                                "spellId": 18288
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 18288
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 11713
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 11713
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25311
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 18881
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 18881
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "warlockAssignedCurseIsActive": {}
                    }
                  }
                },
                "castWarlockAssignedCurse": {}
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "dotIsActive": {
                        "spellId": {
                          "spellId": 25309
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25309
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "and": {
                    "vals": [
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 11713
                          }
                        }
                      },
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 25311
                          }
                        }
                      },
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 18881
                          }
                        }
                      },
                      {
                        "dotIsActive": {
                          "spellId": {
                            "spellId": 25309
                          }
                        }
                      },
                      {
                        "warlockAssignedCurseIsActive": {}
                      }
                    ]
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 20554
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "not": {
                    "val": {
                      "auraIsActive": {
                        "sourceUnit": {
                          "type": "CurrentTarget"
                        },
                        "auraId": {
                          "spellId": 17794
                        }
                      }
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "auraIsActive": {
                    "auraId": {
                      "spellId": 17941
                    }
                  }
                },
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "condition": {
                  "cmp": {
                    "op": "OpGe",
                    "lhs": {
                      "variableRef": {
                        "name": "Dot floor"
                      }
                    },
                    "rhs": {
                      "variableRef": {
                        "name": "Wrack minimum"
                      }
                    }
                  }
                },
                "channelSpell": {
                  "spellId": {
                    "spellId": 1316697
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 25307
                  }
                }
              }
            },
            {
              "action": {
                "castSpell": {
                  "spellId": {
                    "spellId": 11689
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "name": "Boosts",
              "actions": [
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "spellId": 20572
                      }
                    }
                  }
                },
                {
                  "action": {
                    "castSpell": {
                      "spellId": {
                        "itemId": 250937
                      }
                    }
                  }
                }
              ]
            }
          ],
          "valueVariables": [
            {
              "name": "Wrack minimum",
              "value": {
                "const": {
                  "val": "4s"
                }
              }
            },
            {
              "name": "Dot floor",
              "value": {
                "min": {
                  "vals": [
                    {
                      "dotRemainingTime": {
                        "spellId": {
                          "spellId": 25311
                        }
                      }
                    },
                    {
                      "dotRemainingTime": {
                        "spellId": {
                          "spellId": 11713
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        },
        "distanceFromTarget": 20
      }
    }
  }
]);

export const FOREVER_DEFAULT_PRESET = FOREVER_PRESETS[0];
export const FOREVER_DEFAULT_BUILD = FOREVER_DEFAULT_PRESET.build;

// Editable combat settings also retained in logical build exports.
export const WARLOCK_RUNTIME_KEYS = Object.freeze([
  "assignedElements", "demonicRune", "ezThroDynamite",
  "manualTrinket", "autoCooldowns", "channelClipDelayMs", "book",
  "trinketSP", "trinketDuration", "trinketCD"
]);
