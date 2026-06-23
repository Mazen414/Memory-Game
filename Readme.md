# 🧠 Memory Match Challenge

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A dynamic, object-oriented browser game built from scratch using the HTML5 `<canvas>` API. 

**Play the live game here:** [Memory Match Challenge](https://mazen414.github.io/Memory-Game/)

---

## 🎮 About The Game
The Memory Match Challenge is a time-based puzzle game where players must find all matching pairs of cards before the clock runs out. The game features progressive difficulty, dynamic grid scaling, and a persistent local leaderboard to track top scores.

### Features
* **Progressive Levels:** Grid sizes increase (8, 12, 16 cards) and base timers scale with each level.
* **Time Boost Mechanic:** Players can strategically add +5 seconds to the clock once per level.
* **Persistent Leaderboard:** Top 10 high scores and randomly generated player IDs are saved directly to the browser using `localStorage`.
* **Thematic UI:** Custom-styled Bootstrap interface featuring the Istanbul Arel University branding.

---

## ⚙️ Technical Architecture
This project was developed for a Computer Engineering curriculum, focusing heavily on Object-Oriented Programming (OOP) and low-level graphics rendering.

* **Object-Oriented Design:** The game engine is strictly separated into logical classes (`GameManager`, `Card`, `CardGrid`, `DisplayRenderer`).
* **Custom 3D Animations:** Bypassed standard CSS animations to mathematically simulate 3D rotation on a 2D plane using affine transformations (`ctx.translate`, `ctx.scale`, and trigonometric easing).
* **Raw Pixel Manipulation:** Implemented an additive color-blending algorithm that reads the raw `ImageData` array of the canvas and mathematically alters the RGB channels to create a sweeping "frosted glass" reflection over the university logo.

---

## 🚀 How to Run Locally
1. Clone the repository:
   ```bash
   git clone [https://github.com/Mazen414/Memory-Game.git](https://github.com/Mazen414/Memory-Game.git)