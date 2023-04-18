<h1><a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://raw.githubusercontent.com/FireboltCasters/Castle-Ravenloft-Navigator/main/icon.png" width="100" heigth="100" /></a><a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator">castle-ravenloft-navigator</a></h1><h2>A library and tool to distribute students with attestations evenly on examiners</h2>

<p align="center">
  <a href="https://badge.fury.io/js/castle-ravenloft-navigator.svg"><img src="https://badge.fury.io/js/castle-ravenloft-navigator.svg" alt="npm package" /></a>
  <a href="https://img.shields.io/github/license/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://img.shields.io/github/license/FireboltCasters/Castle-Ravenloft-Navigator" alt="MIT" /></a>
  <a href="https://img.shields.io/github/last-commit/FireboltCasters/Castle-Ravenloft-Navigator?logo=git"><img src="https://img.shields.io/github/last-commit/FireboltCasters/Castle-Ravenloft-Navigator?logo=git" alt="last commit" /></a>
  <a href="https://www.npmjs.com/package/castle-ravenloft-navigator"><img src="https://img.shields.io/npm/dm/castle-ravenloft-navigator.svg" alt="downloads week" /></a>
  <a href="https://www.npmjs.com/package/castle-ravenloft-navigator"><img src="https://img.shields.io/npm/dt/castle-ravenloft-navigator.svg" alt="downloads total" /></a>
  <a href="https://github.com/google/gts" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/code%20style-google-blueviolet.svg"/></a>
  <a href="https://shields.io/" alt="Google TypeScript Style"><img src="https://img.shields.io/badge/uses-TypeScript-blue.svg"/></a>
  <a href="https://github.com/marketplace/actions/lint-action"><img src="https://img.shields.io/badge/uses-Lint%20Action-blue.svg"/></a>
    <a href="https://jessemillar.com/r/man-hours"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fmh.jessemillar.com%2Fhours%3Frepo%3Dhttps%3A%2F%2Fgithub.com%2FFireboltCasters%2FCastle-Ravenloft-Navigator" alt="size" /></a>
</p>


## Demo

Live Demo: https://fireboltcasters.github.io/Castle-Ravenloft-Navigator/

<img src="https://raw.githubusercontent.com/FireboltCasters/Castle-Ravenloft-Navigator/master/Demo.gif" alt="Coverage" />

## Web Usage
- Visit the demo page
- Upload a json file of the attestation
- Click on the "Optimize" button

## Load JSON Format

- Define examiners / tutors
    - Each examiner / tutor has a list of days he is available
        - Each day has a list of time slots he is available
- Define groups / students
    - Each group / student can have a selected time slot
        - A selected time slot has
            - the examiner / tutor
            - the day
            - the time slot
    - Each group / student has a list of days he is available
        - Each day has a list of time slots he is available

```
{
    "tutors": {
        "Tutor 1": {
            "Monday": {
                "10:00": true,
                "11:00": true,
                ...
            },
            "Tuesday": {
                "10:00": true,
                "11:00": true,
                ...
            }
        },
        "Tutor 2": {
            ...
        }
    },
    "groups": {
        "Group 1": {
            "selectedSlot": {
                "tutor": "Tutor 1",
                "day": "Monday",
                "time": "10:00",
            },
            "possibleSlots": {
                "Monday": {
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                },
                ...
            }
        },
        "Group 2": {
            ...
        },
        "Group 3": {
            ...
        },
        ...
    }
}
```

## Installtion

```
npm install castle-ravenloft-navigator
```

## Usage

//TODO

```ts
import {...} from "castle-ravenloft-navigator";
```

## Contributors

The FireboltCasters

<a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://contrib.rocks/image?repo=FireboltCasters/Castle-Ravenloft-Navigator" alt="Contributors" /></a>
