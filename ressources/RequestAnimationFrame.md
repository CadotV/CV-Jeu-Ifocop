## Ressources about requestAnimationFrame to build the CV game
# Throttle RAF to a fixed FPS value
https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe

Some tips:
- RAF can be slow down alot in a setInterval processing too much stuff, resulting in a lower framerate.
- timestep = 1000 / fps: will not reach the desired fps cap. e.g. at 58 fps, RAF will skip every 2 frames, resulting in 30 FPS

https://developer.mozilla.org/fr/docs/Games/Techniques/Efficient_animation_for_web_games
for optimisation of RAF.

- use the Javascript profiler !!!