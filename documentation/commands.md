# Commands
Comprehensive list of all commands, with example uses.
- [Commands](#commands)
    - [General (bed)](#general-usage)
    - [Create New Files (new)](#create-new-files)
        - [Create New Entity (new entity)](#create-new-entity)
        - [Create New Item (new item)](#create-new-item)
        - [Create New Block (new block)](#create-new-block)
        - [Create New Animation (new anim)](#create-new-animation)
        - [Create New Animation Controller (new ctrl)](#create-new-animation-controller)
        - [Create New Function (new function)](#create-new-function)
        - [Import Vanilla Entity (new vanilla)](#import-vanilla-entity)
    - [Modify Entities (entity)](#modify-entities)
        - [Add Animations To Entities (entity anim)](#add-animations-to-entities)
        - [Add Component Groups To Entities (entity group)](#add-component-groups-to-entities)
        - [Add Components To Entities (entity component)](#add-components-to-entities)
        - [Add Damage Sensors To Entities (entity sensor)](#add-damage-sensors-to)
        - [Add Properties To Entities (entity property)](#add-properties-to-entities)
            - [Add Property Definition (entity property add)](#add-property-definition)
            - [Add Property Events (entity property event)](#add-property-events)
    - [Package Manager (pkg)](#package-manager)
        - [List Packages (pkg list)](#list-packages)
        - [Import Packages (pkg import)](#import-packages)

## General Usage
CLI to assist Minecraft Bedrock Development. This is the root command, and all other commands are subcommands of this. At the root, you can specify certain paramaters that are globally used, like the paths to the Behavior Pack and Resource Pack, or the indent level for files.

In most use cases, the `--rpath` and `--bpath` are not needed, as when used within a project, the paths will be automatically determined.

The root command has the version and help arguments.

```
Usage: bed [options] [command]

Options:
  --rpath <rp>           Path to Resource Pack
  --bpath <bp>           Path to Behavior Pack
  -i, --indent <number>  set indent tabs level for JSON files (default: "1")
  -v, --version          output the version number
  -h, --help             display help for command

Commands:
  new                    Creates new Bedrock files
  entity                 Modifies Bedrock entities
  pkg                    Package manager for Bedrock files
```
### Example(s)
---
```
bed -v
```
This outputs the current version of the tool, such as `1.0.0`.

---
```
bed -h
```
This outputs the basic help, listing the available options and subcommands.

&nbsp;

---
## Create New Files
Creates new Bedrock files. This is the general command that creates new files such as: entities, items, blocks, etc. The various types of files that can be created are subcommands of `new`.
```
Usage: bed new [options] [command]

Options:
  -h, --help                     display help for command

Commands:
  entity [options] <names...>    Creates new Bedrock entities
  item [options] <names...>      Creates new Bedrock items
  block [options] <names...>     Creates new Bedrock blocks
  anim [options] <names...>      Creates new Bedrock behavior animations
  ctrl [options] <names...>      Creates new Bedrock behavior animation controllers
  function [options] <names...>  Creates new Bedrock functions
  vanilla [options] <names...>   Imports a vanilla Bedrock entity
  help [command]                 display help for command
```

&nbsp;

---
## Create New Entity
Creates new Bedrock entities. This command creates entities of various types, and can speed up the repetitive steps involved with creating entity files.
```
Usage: bed new entity [options] <names...>

Arguments:
  names              entity names as "namespace:entity"

Options:
  -l, --lang         add lang file
  -t, --type <char>  set entity type: dummy, passive, hostile (choices: "d", "h", "p", default: dummy)
  -c, --client       create client entity in the resource path. Will also create a default geo and texture for the entity
  -h, --help         display help for command
```
### Example(s)
---
```
bed new entity ldz:test
```
This outputs a file at `BP/entities/test.json`, creating a dummy entity with basic components all dummy entities share, including a despawn event that gets called when the entity takes void damage.

---
```
bed new entity --type h --client --lang ldz:test
```
This specifies that the entity should be hostile, that it should create the client files (the rp entity, geo, and texture files), and that lines will be added to the lang file. The lang file gets the Entity Name, and because it is hostile or passive, rather than a dummy it will also create a Spawn Egg entry.

&nbsp;

---
## Create New Item
Creates new Bedrock items. This command creates items of various types, and can speed up the repetitive steps involved with creating item files.
```
Usage: bed new item [options] <names...>

Arguments:
  names                     item names as "namespace:item"

Options:
  --no-lang                 do not add lang file
  -s, --stack <stack_size>  max stack size (default: "64")
  -t, --type <item_type>    basic (choices: "basic", "weapon", "projectile", "food", "armor_set", "helmet", "chestplate", "leggings", "boots")
  -h, --help                display help for command
```
### Example(s)
---
```
bed new item ldz:test_item
```
This creates an item with all defaults, making a basic item with a stack size of 64. It creates files at `BP/items/test_item.json`, `RP/items/test_item.json`, and creates/modifies `RP/textures/item_texture.json` adding in a references to the new texture created at `RP/textures/items/test_item.png`, additionally since we did not specify `--no-lang` we add a lang file entry to the category `## ITEM NAMES`.

---
```
bed new item --type weapon --stack 1 ldz:test_weapon
```
This is the syntax for creating an attachable. In addition to all the files mentioned in the previous example, this adds an `RP/entity/player.entity.json` with all the variables and animations needed for attachables, along with the attachable file, modifications to the player animations, and a custom geo and texture for the new attachable.

---
```
bed new item --type armor_set ldz:test_armor
```
This creates an **experimental** armor set. Generating helmet, chestplate, leggings, and boots items, setting up their item files with all the required setup for armor, and the attachable files with textures and item sprites, along with lang file entries.

Note that in this case, we don't need to specify `--stack 1` since the armor type will automatically set the stack size to 1. Additionally armor generated this way will have `minecraft:stick` as the default repair material.

&nbsp;

---
## Create New Block
Creates new Bedrock blocks. This command creates blocks, and can speed up the repetitive steps involved with creating block files.

```
Usage: bed new block [options] <names...>

Arguments:
  names                      block names as "namespace:block"

Options:
  -l, --lang                 add lang file
  -e, --emissive <emission>  block emmission level [0.0-1.0]
  -t, --table                create a loot table
  -h, --help                 display help for command
```
### Example(s)
---
```
bed new block --lang ldz:test_block
```
This creates a new simple block with an empty loot table and a lang file reference. A block file, as well as a texture and terrain_texture entity are generated.

---
```
bed new block --emissive 1.0 --table --lang ldz:test_lit_block
```
This creates a new block that emits light level 15, a new loot table that drops itself, along with everything listed in the above example.

&nbsp;

---
## Create New Animation
Creates new Bedrock behavior animations.

```
Usage: bed new anim [options] <names...>

Arguments:
  names                      animation names names as "entity.anim"

Options:
  -l, --loop                 should the animation loop
  -c, --commands <commands>  the commands to play (default: "/say anim_name")
  -t, --time                 the animation length
  -h, --help                 display help for command
```
### Example(s)
---
```
bed new anim generic.test
```
This outputs an animation with all defaults, an animation length of 1 seconds, non-looping, and a say command with the animation name.
```json
{
	"format_version": "1.16.0",
	"animations": {
		"animation.generic.test": {
			"animation_length": 1,
			"timeline": {
				"0.0": [
					"/say test"
				]
			}
		}
	}
}
```
---
The `--time` and `--commands` arguments are currently not working.
&nbsp;

---
## Create New Animation Controller
Creates new Bedrock behavior animation controllers.

```
Usage: bed new ctrl [options] <names...>

Arguments:
  names                            controller names as "entity.anim"

Options:
  -e, --entry [on entry commands]  the commands to play on entry (default: "/say anim_name")
  -x, --exit [on exit commands]    the commands to play on exit (preset: "/say anim_name")
  -a, --anim <animations>          the animations to play
  -q, --query [query]              the query to transition from default (default: "true")
  -t, --transition [transition]    the query to transition back to default (preset: "true")
  -h, --help                       display help for command
```
### Example(s)
---
```
bed new ctrl generic.test
```
This outputs an animation controller with all the defaults. An on_entry that says the controller name, a transition to `test` with the condition of true, no transition back to `default`, no animations, and no on_exit.
```json
{
	"format_version": "1.19.0",
	"animation_controllers": {
		"controller.animation.generic.test": {
			"initial_state": "default",
			"states": {
				"default": {
					"transitions": [
						{
							"test": "true"
						}
					]
				},
				"test": {
					"on_entry": [
						"/say Entered test"
					]
				}
			}
		}
	}
}
```
---
```
bed new ctrl --entry "/say Entered" --query q.is_jumping --transition !q.is_jumping --exit "/say Exited" generic.new_test
```
This outputs a more complex controller with specified transition queries and specific commands in on_entry and on_exit.
```json
{
	"format_version": "1.19.0",
	"animation_controllers": {
		"controller.animation.generic.new_test": {
			"initial_state": "default",
			"states": {
				"default": {
					"transitions": [
						{
							"new_test": "q.is_jumping"
						}
					]
				},
				"new_test": {
					"on_entry": [
						"/say Entered"
					],
					"transitions": [
						{
							"default": "!q.is_jumping"
						}
					],
					"on_exit": [
						"/say Exited"
					]
				}
			}
		}
	}
}
```
---
Currently the `--anim` argument doesn't work.

&nbsp;

---
## Create New Function
Creates new Bedrock functions. When creating functions, you can use special characters to add data into the command: `$f` inserts the filename into the command, `$i` inserts the index of the batch generated command
```
Usage: bed new function [options] <names...>

Arguments:
  names                            function names as "foo/bar"

Options:
  -c, --commands <commands>        the function commands, seperated by ";"
  -n, --number <number>            the number times commands should be created in the files (default: "1")
  -d, --description <description>  the description of the function to be used as a comment
  -s, --source <source>            where is this function called from, used as a comment
  -h, --help                       display help for command
```
### Example(s)
---
```
bed new function foo
```
This creates a new function at `BP/functions/foo.mcfunction` with the defaults, automatically creating a `say foo` command and creating a description with the command's title and an unknown source.
```mcfunction
## FOO
## CALLED FROM ???

say foo
```
---
```
bed new function --description "A test function" --source "a developer" --commands "execute as @s[tag=dev] run say this is a test" admin/test
```
Here we specify the function's description, where it's called from, and what command it should run. Additionally we specify the folder it should go in, so at `BP/functions/admin/test.mcfunction` we have:
```mcfunction
## A TEST FUNCTION
## A DEVELOPER FUNCTION

execute as @s[tag=dev] run say this is a test
```
---
```
bed new function --commands "scoreboard players set @s Count $i;say My score is $i" --number 50 player/set_coun
t
```
This creates a function at `BP/functions/player/set_count` where the two commands included as args are repeated 50 times, with the values between 1-50 inserted where `$i` appears.
```mcfunction
## SET_COUNT
## CALLED FROM ???

scoreboard players set @s Count 1
say My score is 1
scoreboard players set @s Count 2
say My score is 2
scoreboard players set @s Count 3
say My score is 3
scoreboard players set @s Count 4
say My score is 4
scoreboard players set @s Count 5
say My score is 5
scoreboard players set @s Count 6
say My score is 6
scoreboard players set @s Count 7
say My score is 7
scoreboard players set @s Count 8
say My score is 8
scoreboard players set @s Count 9
say My score is 9
scoreboard players set @s Count 10
say My score is 10
...
```

&nbsp;

---
## Import Vanilla Entity
Imports a vanilla Bedrock entity. This command will import an entity from [Mojang's Bedrock Samples](https://github.com/Mojang/bedrock-samples). This supports partial [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)), so *.json would import all the entities in the BP/entities folder.
```
Usage: bed new vanilla [options] <names...>

Arguments:
  names         entity files as "player.json"

Options:
  -c, --client  create client entity in the resource path
  -h, --help    display help for command
```
### Example(s)
---
```
bed new vanilla player.json
```
This imports the player.json file, copied directly from Mojang's repository so it will always import the most up-to-date version of the file.
```
bed new vanilla --client pig.json
```
The `--client` argument means we'll also import the `pig.entity.json` file into the project.

&nbsp;

---
## Modify Entities
Modifies Bedrock entities. Rather than creating files, these commands will modify existing entities, adding things like animation references, components, and properties. 

Most of these commands accept a `--file <file>` option, defaulting to `**/*.json` which is a [glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)) for every .json file in `BP/entities`. But you can specify a direct filename with `player.json`, every file in a certain folder like `vanilla/*.json`, or every entity that ends with 'skeleton' with `*skeleton.json`.

Most commands also accept a `--type <family type>` which further filters the entities, only getting entities with a certain family type. So the options `--file **/*.json --family horse` will grab every file that includes the family type 'horse', even if that family type only exists in component group.
```
Usage: bed entity [options] [command]

Options:
  -h, --help                       display help for command

Commands:
  anim [options] <names...>        Adds an animation or animation controller reference to entities
  group [options] <group>          Adds a component group to entities
  component [options] <component>  Adds a component to entities
  sensor [options] <sensor>        Adds a damage sensor to entities
  property                         Adds property or property events to entities
  help [command]                   display help for command
```

&nbsp;

---
## Add Animations To Entities
Adds an animation or animation controller reference to entities.
```
Usage: bed entity anim [options] <names...>

Arguments:
  names                     animation names as "entity.anim"

Options:
  -t, --type <family type>  filter entities by family type
  -f, --file <file>         the entity files that should be modified (default: "**/*.json")
  -s, --script              should these animations be added to script
  -h, --help                display help for command
```
### Example(s)
---
```
bed entity anim --file player.json --script player.test
```
This will attempt to find an animation, or controller called 'player.test'. If it finds it, it will add that reference to the player file, automatically determining whether it is an animation or animation controller, and because we included the `--script` option, it will add it to `animate>scripts`.

&nbsp;

---
## Add Component Groups To Entities
Desc...
```
help
```
### Example(s)
---

&nbsp;

---
## Add Components To Entities
Adds a component group to entities. This accepts a JSON object that will get added to the entities' component groups.
```
Usage: bed entity group [options] <group>

Arguments:
  group                     the component group as a json object {group_name:{minecraft:is_baby:{}}}

Options:
  -t, --type <family type>  filter entities by family type
  -f, --file <file>         the entity files that should be modified (default: "**/*.json")
  -h, --help                display help for command
```
### Example(s)
---
```
bed entity group --file player.json {new_group:{}}
```
This adds an empty component group `new_group`, and two events `add_new_group` and `remove_new_group` that do exactly what you'd expect.
```
bed entity group {new_loot:{minecraft:loot:{table:\"loot_tables/custom.json\"}}}
``` 
This adds a group to every single entity that looks like this:
```json
{
  "new_loot": {
				"minecraft:loot": {
					"table": "loot_tables/custom.json"
				}
			}
}
```
Notice that when writing the command, we escaped the quotes with \\", that prevents the command line from interpretting the input and losing the quotes. Without the quotes you will get feedback saying:
```
Invalid JSON: {new_loot:{minecraft:loot:{table:loot_tables/custom.json}}}
```

&nbsp;

---
## Add Damage Sensors To Entities
Adds a damage sensor to entities. This is especially helpful when you need to add a damage sensor filter to every single mob.

```
Usage: bed entity sensor [options] <sensor>

Arguments:
  sensor                    the damage sensor as a json object {cause: \"all\", deals_damage: false}

Options:
  -t, --type <family type>  filter entities by family type
  -f, --file <file>         the entity files that should be modified (default: "**/*.json")
  -h, --help                display help for command
```
### Example(s)
---
```
bed entity sensor {cause:\"all\",deals_damage:false}
```
This adds a damage sensor entry to every entity in the project, it will add a damage sensor to the entity if it's missing one, and convert the sensor to an array if it's currently an object, the above command would add an entry like this:
```json
{
	"cause": "all",
	"deals_damage": false
}
```
**Please Note**, the damage sensor entries from this command are always added to the bottom of the list, so all the other damage sensors will be executed first.

&nbsp;

---
## Add Properties To Entities
Adds property or property events to entities.

```
Usage: bed entity property [options] [command]

Options:
  -h, --help                   display help for command

Commands:
  add [options] <names...>     Adds a property to entities
  event [options] <values...>  Adds a property event to entities
  help [command]               display help for command
```
### Example(s)
---

&nbsp;

---
## Add Property Definition
Adds a property to entities.

```
Usage: bed entity property add [options] <names...>

Arguments:
  names                           property names as "namespace:property"

Options:
  -t, --type <family type>        filter entities by family type
  -f, --file <file>               the entity files that should be modified (default: "**/*.json")
  -p, --property <property type>  the type of property (choices: "bool", "enum", "float", "int", default: "bool")
  -v, --values <values...>        the values, either a list of enum values or a min-max
  -d, --default <default>         the default value
  -c, --client                    should use client_sync
  -h, --help                      display help for command
```
### Example(s)
---

&nbsp;

---
## Add Property Events
Adds a property event to entities.
```
Arguments:
  values                          the values to set the property to

Options:
  -t, --type <family type>        filter entities by family type
  -f, --file <file>               the entity files that should be modified (default: "**/*.json")
  -p, --property <property name>  the name of the property to set
  -e, --event <event name>        a custom event name, otherwise defaults to "set_property_to_value
  -h, --help                      display help for command
```
### Example(s)
---

&nbsp;

---
## Package Manager
Package manager for Bedrock files.

```
Usage: bed pkg [options] [command]

Options:
  -h, --help            display help for command

Commands:
  list [options]        List packages at repo
  import <packages...>  import packages from repo
  help [command]        display help for command
```
### Example(s)
---

&nbsp;

---
## List Packages
List packages in repo.

```
Usage: bed pkg list [options]

Options:
  -d, --detailed        gets extra details about the package, if available
  -f --filter <filter>  filter the packages by name or category
  -h, --help            display help for command
```
### Example(s)
---

&nbsp;

---
## Import Packages
import packages from repo.

```
Usage: bed pkg import [options] <packages...>

Arguments:
  packages    the packages to import as either index value or name

Options:
  -h, --help  display help for command
```
### Example(s)
---

&nbsp;

---