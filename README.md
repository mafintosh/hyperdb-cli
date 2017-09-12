# hyperdb-cli

CLI for hyperdb

```
npm install -g hyperdb-cli
```

## Usage

``` sh
hyperdb ./db <key> # launches interactive mode
hyperdb ./db createWriteStream # streams ndjson in from stdin: {key: key, value: value}
```

## example

```
~/src/js/hyperdb-cli 🐈  echo '{"key": "foo", "value": "bar"}' | hyperdb ./db createWriteStream
$ db.key = 775f3cd5fd50671f05d900f81b25370ad97d157814538a63248e3ad437d0e865
$ db.local.key = 775f3cd5fd50671f05d900f81b25370ad97d157814538a63248e3ad437d0e865
{"key":"foo","success":true}
~/src/js/hyperdb-cli 🐈  hyperdb ./db
$ db.key = 775f3cd5fd50671f05d900f81b25370ad97d157814538a63248e3ad437d0e865
$ db.local.key = 775f3cd5fd50671f05d900f81b25370ad97d157814538a63248e3ad437d0e865
$ get key > values...
$ put key value
$ authorize key
get foo
> bar
```

## License

MIT
