# bastila-highlight

[Bastila](https://bastila.app/) is a tool for removing deprecated code. You define deprecated patterns using regex in the app and then prevent additional usages of those deprecated patterns from being used. The tool can also be used to track the removal of these patterns as well.

## Features

Once setup, this extension will highlight all of the deprecated patterns you have defined in the Bastila app. The extension starts once VSC has finished launching.

## Requirements

1. Setup a [Bastila](https://bastila.app/) account
2. Create some standards you would like to enforce
3. Generate a BASTILA_KEY to authenticate this tool
4. Add your BASTILA_KEY to your VSC settings.json
```
"settings": {
  "bastila.BASTILA_KEY": "Your key"
}
```

## Known Issues

* You can only have one BASTILA_KEY set which means you can only highlight one repository worth of issues.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.4.0

Initial pre-release.
