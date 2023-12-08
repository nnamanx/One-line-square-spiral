<!-- [![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Xar3QeJr) -->


# Laman Khudadatzada- Computer Graphics Homework 1

## 🔗 Video Presentation
[watch the video presentation](https://www.facebook.com/61553128464007/videos/1980716358988510/?notif_id=1698768906317495&notif_t=video_processed&ref=notif)


## 🔗 Source Links
[downloading editted image](https://bobbyhadz.com/blog/javascript-download-image)

[reducing image resolution](https://stackoverflow.com/questions/61623303/c-rgb-values-calculating-the-average-of-rgb-values-for-a-blur-filter)

[drawing sqaure on canvas](https://dirask.com/posts/JavaScript-draw-square-on-canvas-element-DKL5gp)

[drawing sqaure on canvas](https://stackoverflow.com/questions/49807779/drawing-square-using-canvas-javascript)

## Loading

        var canvas;
        var ctx;
        var imageData;

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        function loadImage() {

            var input = document.getElementById("image-input");
            var file = input.files[0];

            if (file) {

                var reader = new FileReader();

                reader.onload = function (e) {

                    var img = new Image();
                    img.onload = function () {

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    };

                    img.src = e.target.result;

                };

                reader.readAsDataURL(file);
            }
        }
