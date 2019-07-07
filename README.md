# i18next Spreadsheets

i18next with google spreadsheets

## Installation

Command-line:

``` sh
npm install -g i18next-spreadsheet
```

## Help

``` sh
$ i18next-spreadsheet --help

Usage: i18next-spreadsheet <spreadsheet-id> [options]

Options:
  -v, --version           output the version number
  -s, --credentials <s>   Service Account credentials JSON data or file path
  -p, --locales-path <p>  Locale files path
  -n, --newline           Locale files end with a newline
  -h, --help              output usage information
```

## Usage (CLI)

``` sh
i18next-spreadsheet SPREADSHEET_ID -s tmp/credentials.json -p public/locales
```

## About authentication

Since Google enforces OAuth 2.0, this module offers arguments for Service Account JSON credentials.

- [Guides](https://developers.google.com/sheets/api/quickstart/nodejs?authuser=1)
- [Reference](https://developers.google.com/sheets/api/reference/rest/?authuser=1)
