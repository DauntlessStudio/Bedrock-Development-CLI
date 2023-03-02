#! /usr/bin/env node
import {Command, Option, OptionValues} from 'commander';
import * as Global from 'bedrock-development/bin/app/globals';
import * as Entity from 'bedrock-development/bin/app/entity';
import * as Item from 'bedrock-development/bin/app/item';
import * as Block from 'bedrock-development/bin/app/block';
import * as Animation from 'bedrock-development/bin/app/animations';
import * as Function from 'bedrock-development/bin/app/functions';
import * as Package from 'bedrock-development/bin/app/package_manager';
import axios from 'axios';

let program = new Command();
const version = '1.0.14'

program
  .name('bed')
  .description('CLI to assist Minecraft Bedrock Development')
  .option('--rpath <rp>', 'Path to Resource Pack')
  .on('option:rpath', Global.setResourcePath)
  .option('--bpath <bp>', 'Path to Behavior Pack')
  .on('option:bpath', Global.setBehaviorPath)
  .option('-i, --indent <number>', 'set indent tabs level for JSON files', '1')
  .on('option:indent', Global.setIndentLevel)
  .version(version, '-v, --version')
  .action(printVersion)

// #region New Commands
let createNew = program.command('new')
  .description('Creates new Bedrock files');

createNew.command('entity')
  .description('Creates new Bedrock entities')
  .argument('<names...>', 'entity names as "namespace:entity"')
  .option('-l, --lang', 'add lang file')
  .addOption(new Option('-t, --type <char>', 'set entity type: dummy, passive, hostile',).choices(['d', 'h', 'p']).default('d', 'dummy'))
  .option('-c, --client', 'create client entity in the resource path. Will also create a default geo and texture for the entity')
  .action(triggerCreateNewEntity)
  .hook('postAction', printVersion);

createNew.command('item')
  .description('Creates new Bedrock items')
  .argument('<names...>', 'item names as "namespace:item"')
  .option('--no-lang', 'do not add lang file')
  .option('-s, --stack <stack_size>', 'max stack size', '64')
  .addOption(new Option('-t, --type <item_type>', 'basic').choices(Object.keys(Item.itemType)))
  .action(triggerCreateNewItem)
  .hook('postAction', printVersion);

createNew.command('block')
  .description('Creates new Bedrock blocks')
  .argument('<names...>', 'block names as "namespace:block"')
  .option('-l, --lang', 'add lang file')
  .option('-e, --emissive <emission>', 'block emmission level [0.0-1.0]')
  .option('-t, --table', 'create a loot table')
  .action(triggerCreateNewBlock)
  .hook('postAction', printVersion);

createNew.command('anim')
  .description('Creates new Bedrock behavior animations')
  .argument('<names...>', 'animation names names as "entity.anim"')
  .option('-l, --loop', 'should the animation loop')
  .option('-c, --commands <commands>', 'the commands to play', '/say anim_name')
  .option('-t, --time', 'the animation length', '1.0')
  .action(triggerCreateNewAnimation)
  .hook('postAction', printVersion);

createNew.command('ctrl')
  .description('Creates new Bedrock behavior animation controllers')
  .argument('<names...>', 'controller names as "entity.anim"')
  .addOption(new Option('-e, --entry [on entry commands]', 'the commands to play on entry').default('/say anim_name'))
  .addOption(new Option('-x, --exit [on exit commands]', 'the commands to play on exit').preset('/say anim_name'))
  .option('-a, --anim <animations>', 'the animations to play')
  .option('-q, --query [query]', 'the query to transition from default', 'true')
  .addOption(new Option('-t, --transition [transition]', 'the query to transition back to default').preset('true'))
  .action(triggerCreateNewController)
  .hook('postAction', printVersion);

createNew.command('function')
  .description('Creates new Bedrock functions')
  .argument('<names...>', 'function names as "foo/bar"')
  .option('-c, --commands <commands>', 'the function commands, seperated by ";"')
  .option('-n, --number <number>', 'the number times commands should be created in the files', '1')
  .option('-d, --description <description>', 'the description of the function to be used as a comment')
  .option('-s, --source <source>', 'where is this function called from, used as a comment')
  .addHelpText('before', 'special characters can be used to provide additional formatting. $(F)f inserts the filename into the command, $(I)i inserts the index of the batch generated command')
  .action(triggerCreateNewFunction)
  .hook('postAction', printVersion);

createNew.command('vanilla')
  .description('Imports a vanilla Bedrock entity')
  .argument('<names...>', 'entity files as "player.json"')
  .option('-c, --client', 'create client entity in the resource path. Will also create a default geo and texture for the entity')
  .action(triggerCreateVanillaEntity)
  .hook('postAction', printVersion);
// #endregion

// #region Entity Commands
let entity = program.command('entity')
  .description('Modifies Bedrock entities');

entity.command('anim')
  .description('Adds an animation or animation controller reference to entities')
  .argument('<names...>', 'animation names as "entity.anim"')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .option('-s, --script', 'should these animations be added to script')
  .action(triggerEntityAddAnim)
  .hook('postAction', printVersion);

entity.command('group')
  .description('Adds a component group to entities')
  .argument('<group>', 'the component group as a json object {group_name:{minecraft:is_baby:{}}}')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .action(triggerEntityAddGroup)
  .hook('postAction', printVersion);

entity.command('component')
  .description('Adds a component to entities')
  .argument('<component>', 'the component as a json object {minecraft:is_baby:{}}')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .option('-o, --overwrite', 'should the new component overwrite the old one rather than merge with it?')
  .action(triggerEntityAddComponent)
  .hook('postAction', printVersion);

entity.command('sensor')
  .description('Adds a damage sensor to entities')
  .argument('<sensor>', 'the damage sensor as a json object {cause: \\"all\\", deals_damage: false}')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .action(triggerEntityAddDamageSensor)
  .hook('postAction', printVersion);

let property = entity.command('property')
  .description('Adds property or property events to entities');

property.command('add')
  .description('Adds a property to entities')
  .argument('<names...>', 'property names as "namespace:property"')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .addOption(new Option('-p, --property <property type>', 'the type of property').choices(['bool', 'enum', 'float', 'int']).default('bool'))
  .option('-v, --values <values...>', 'the values, either a list of enum values or a min-max')
  .option('-d, --default <default>', 'the default value')
  .option('-c, --client', 'should use client_sync')
  .action(triggerEntityAddProperty)
  .hook('postAction', printVersion);

property.command('event')
  .description('Adds a property event to entities')
  .argument('<values...>', 'the values to set the property to')
  .option('-t, --type <family type>', 'filter entities by family type')
  .option('-f, --file <file>', 'the entity files that should be modified', '**/*.json')
  .addOption(new Option('-p, --property <property name>', 'the name of the property to set').makeOptionMandatory(true))
  .option('-e, --event <event name>', 'a custom event name, otherwise defaults to "set_property_to_value')
  .action(triggerEntityAddPropertyEvent)
  .hook('postAction', printVersion);
// #endregion

// #region Package Commands
let pkg = program.command('pkg')
  .description('Package manager for Bedrock files');

pkg.command('list')
  .description('List packages at repo')
  .option('-d, --detailed', 'gets extra details about the package, if available')
  .option('-f --filter <filter>', 'filter the packages by name or category')
  .action(triggerPackagesList)
  .hook('postAction', printVersion);

pkg.command('import')
  .description('import packages from repo')
  .argument('<packages...>', 'the packages to import as either index value or name')
  .action(triggerPackagesImport)
  .hook('postAction', printVersion);

// #endregion

program.parse();

async function setPaths() {
  if (!Global.set_paths) {
    await Global.setResourcePath(undefined);
    await Global.setBehaviorPath(undefined);
  }
}

// #region Triggers
async function triggerCreateNewEntity(names: string[], options: OptionValues) {
  await setPaths();
  const type = options.type;
  const lang = options.lang;
  const client = options.client;
  await Entity.createNewEntity(names, lang, type, client);
}

async function triggerCreateNewItem(names: string[], options: OptionValues) {
  await setPaths();
  const lang = options.lang;
  const stack = options.stack;
  const type = options.type as Item.itemType;
  await Item.createNewItem(names, lang, stack, type);
}

async function triggerCreateNewBlock(names: string[], options: OptionValues) {
  await setPaths();
  const lang = options.lang;
  const emissive = options.emissive;
  const table = options.table;
  await Block.createNewBlock(names, lang, emissive, table);
}

async function triggerCreateNewAnimation(names: string[], options: OptionValues) {
  await setPaths();
  const loop = options.loop;
  const commands = options.commands;
  const time = options.time;
  await Animation.createNewAnimation(names, loop, commands, time);
}

async function triggerCreateNewController(names:string[], options: OptionValues) {
  await setPaths();
  const entry = options.entry;
  const exit = options.exit;
  const anim = options.anim;
  const query = options.query;
  const transition = options.transition;
  await Animation.createNewController(names, entry, exit, anim, query, transition);
}

async function triggerCreateNewFunction(names: string[], options: OptionValues) {
  await setPaths();
  const commands = options.commands;
  const number = options.number;
  const description = options.description;
  const source = options.source;
  await Function.createNewFunction(names, commands, number, description, source);
}

async function triggerEntityAddAnim(names: string[], options: OptionValues) {
  await setPaths();
  const family = options.type;
  const file = options.file;
  const script = options.script;
  await Entity.entityAddAnim(names, family, file, script);
}

async function triggerEntityAddGroup(group: string, options: OptionValues) {
  await setPaths();
  const family = options.type;
  const file = options.file;
  await Entity.entityAddGroup(group, family, file);
}

async function triggerEntityAddComponent(component: string, options: OptionValues) {
  await setPaths();
  const family = options.type;
  const file = options.file;
  const overwrite = options.overwrite;
  await Entity.entityAddComponent(component, family, file, overwrite);
}

async function triggerEntityAddProperty(names: string[], options: OptionValues) {
  await setPaths();
  const type = options.type;
  const file = options.file;
  const property = options.property;
  const values = options.values;
  const default_value = options.default;
  const client = options.client;
  await Entity.entityAddProperty(names, type, file, property, values, default_value, client);
}

async function triggerEntityAddPropertyEvent(names: string[], options: OptionValues) {
  await setPaths();
  const type = options.type;
  const file = options.file;
  const property = options.property;
  const event = options.event;
  await Entity.entityAddPropertyEvent(names, type, file, property, event);
}

async function triggerEntityAddDamageSensor(sensor: string, options: OptionValues) {
  await setPaths();
  const type = options.type;
  const file = options.file;
  await Entity.entityAddDamageSensor(sensor, type, file);
}

async function triggerPackagesList(options: OptionValues) {
  const verbose = options.detailed;
  const filter = options.filter;

  try {
    let response = await Package.packageList(filter);

    for (const pkg of response) {
      console.log(`[${pkg.index}] ${Global.chalk.green(`${pkg.display_name}`)}`);
      if (verbose && pkg.description) {
        console.log(`\t${pkg.description}`)
      }
    }
  } catch (error) {
    console.log(`${Global.chalk.red(`GITHUB_TOKEN either missing or invalid`)}`);
    console.log(`${Global.chalk.yellow('Create Token at: https://github.com/settings/tokens/new')}`);
    console.log(`${Global.chalk.yellow('Paste Token into new Environment Variable called GITHUB_TOKEN')}`);
  }
}

async function triggerPackagesImport(names: string[]) {
  await setPaths();
  try {
    await Package.packageImport(names);
  } catch (error) {
    console.log(`${Global.chalk.red(`GITHUB_TOKEN either missing or invalid`)}`);
    console.log(`${Global.chalk.yellow('Create Token at: https://github.com/settings/tokens/new')}`);
    console.log(`${Global.chalk.yellow('Paste Token into new Environment Variable called GITHUB_TOKEN')}`);
  }
}

async function triggerCreateVanillaEntity(names: string[], options: OptionValues) {
  await setPaths();
  const client = options.client;
  await Entity.createVanillaEntity(names, client);
}
// #endregion

async function printVersion() {
  let result = await axios.get('https://registry.npmjs.org/bedrock-development-cli/latest');
  let latest_version = result.data.version;
  if (version !== latest_version) {
    console.log(`${Global.chalk.yellow(`A new release of bed is available:`)} ${Global.chalk.cyan(`${version} → ${latest_version}`)}`);
    console.log(`${Global.chalk.yellow('npm i bedrock-development-cli@latest -g')}`);
  }
}