# WEB-CAD-3D

![IMG](docs/web-cad-3d.gif)

![](https://img.shields.io/badge/type-JS_Library-brightgreen.svg "Project type")
![](https://img.shields.io/github/repo-size/LorenzoCorbella74/my-web-cad-3d "Repository size")
![](https://img.shields.io/github/package-json/v/LorenzoCorbella74/my-web-cad-3d)

Following my [previous experiment in 2D](https://github.com/LorenzoCorbella74/my-web-cad) here it is the 3D version made with [Three.js](https://threejs.org).

## Features
- [x] Box, Half Cylinder and Quarter of cylinder shapes 
- [x] Select, move, delete, resize and rotate operations on shapes
- [x] Interpolated Animation with Tween.js shapes
- [x] Pan & Zoom System with [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [ ] UNDO & REDO System
- [x] "Snap to Grid" System (with 5 steps)
- [x] Fill Commands panel with Color palette sidebar
- [x] Shortcut Keys
- [ ] Text and Measures 
- [ ] Import and export drawings in .json format


## Shortcut Keys
| s                      | Keys                                                                          |
|------------------------|-------------------------------------------------------------------------------|
| Create                 | ESC / space    (when pressed multiple times switch from cube to Half Cylinder and Quarter of cylinder)                                                                   |
| Grid size                   | 1,2,3,4,5                                                                             |
| Move                   | m    (press ctrl for move inside)                                                                             |
| Delete                 | d                                                                             |
| Pan                    | p                                                                             |
| Rotate                 | r                                                                             |
| Edit \(pull, push\) | e   (press ctrl for push)                                                                          |


## Todos
- [ ] More shapes
- [ ] UNDO & REDO
- [ ] More shape transformations
- [ ] Groups and Explode commands


# Demo
[check the app online](https://web-cad3d-2020.netlify.app/) or test things locally by just installing dependancies with `npm i`and running the local development environment with `npm start`.  SVG Icons courtesy from [materialdesignicons.com](https://materialdesignicons.com/).

## Bugs
- Uhm, please let me know...!

## License
This project is licensed under the ISC License.