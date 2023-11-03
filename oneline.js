/*
    CSCI 2408 Computer Graphics Fall 2023 
    (c)2023 by Laman Khudadatzada
    Submitted in partial fulfillment of the requirements of the course.
*/


window.onload = function () {

    const customizedImage = new CustomizedImage();
    const drawSpiral = new DrawSpiral(customizedImage);

    customizedImage.loadImage();

    // Event listeners
    document.getElementById('grayscale').addEventListener('click', () => customizedImage.applyGrayscale());
    document.getElementById('reduced-resolution').addEventListener('click', () => customizedImage.reduceResolution());
    document.getElementById('spiral').addEventListener('click', () => drawSpiral.spiral());
    document.getElementById('curved-spiral').addEventListener('click', () => drawSpiral.curvedSpiral());
    document.getElementById('downloadLink').addEventListener('click', () => customizedImage.downloadEditedImage());
};


class CustomizedImage {

    constructor() {

        this.canvas = document.getElementById("gl-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.imageData = null;
    }

    // PART I
    // LOADING PICTURE: When the window is loaded, this function will be executed 
    loadImage() {

        // Adding an event listener
        document.getElementById('imageInput').addEventListener('change', (e) => {

            const imageInput = e.target.files[0];

            if (imageInput) {

                const reader = new FileReader();

                // Defining an event handler for when the file is loaded
                reader.onload = (event) => {
                    const image = new Image();

                    // Setting the 'src' attribute of the image
                    image.src = event.target.result;

                    // Defining an event handler 
                    image.onload = () => this.onImageLoad(image);
                };

                // reading as url 
                reader.readAsDataURL(imageInput);
            }
        });
    }

    onImageLoad(image) {

        this.canvas.width = image.width;
        this.canvas.height = image.height;

        // Drawing the loaded image (top left) 
        this.ctx.drawImage(image, 0, 0, image.width, image.height);
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }


    // PART II
    // The GRAYSCALE effect
    applyGrayscale() {

        // The order should be considered
        if (!this.imageData) {

            // If no image data, show an alert and exit the function
            alert("Please, upload an image first");
            return;
        }

        const data = this.imageData.data;

        // Loop through the pixel data and calculate grayscale values
        // Data at index i is the Red component
        // Data at index i + 1 is the Green component
        // Data at index i + 2 is the Blue component
        for (let i = 0; i < data.length; i += 4) {
            const grayScaleValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = grayScaleValue;
            data[i + 1] = grayScaleValue;
            data[i + 2] = grayScaleValue;
        }

        // Updating the canvas with the grayscale image
        this.ctx.putImageData(this.imageData, 0, 0);
        this.canvas.style.display = 'block';

    }

    // PART III
    // The REDUCED RESOLUTION effect
    reduceResolution() {

        //In case of not considering the order of steps
        if (!this.imageData) {

            // If no image data, show an alert and exit the function
            alert("Please, upload an image first");
            return;
        }

        // The size of the grid cells for the reduction
        const cell_size = 5;

        // Calculating the dimensions of the reduced canvas for height & width
        const reduced_height = this.canvas.height;
        const reduced_width = this.canvas.width;

        // Loop through the reduced canvas grid
        for (let y = 0; y < reduced_height; y += cell_size) {

            for (let x = 0; x < reduced_width; x += cell_size) {

                // Calculate the starting position of the current cell
                const startX = x * cell_size;
                const startY = y * cell_size;

                // Creating an empty array for storing
                const sum = [0, 0, 0];

                // Nested loop to iterate over each pixel within the current cell
                for (let i = 0; i < cell_size; i++) {

                    for (let j = 0; j < cell_size; j++) {

                        // Calculate the index of the pixel in the original image's data array
                        const dataIndex = ((i + y) * this.canvas.width + (j + x)) * 4;

                        // RGB values for the pixel
                        sum[0] += this.imageData.data[dataIndex];
                        sum[1] += this.imageData.data[dataIndex + 1];
                        sum[2] += this.imageData.data[dataIndex + 2];
                    }
                }

                // The average RGB values for the cell
                const average_red = sum[0] / (cell_size * cell_size);
                const average_green = sum[1] / (cell_size * cell_size);
                const average_blue = sum[2] / (cell_size * cell_size);

                // Filling the canvas with reduced resolution
                this.ctx.fillStyle = `rgb(${average_red},${average_green},${average_blue})`;

                // Draws a 1x1 pixel rectangle at the (x, y)
                this.ctx.fillRect(x, y, cell_size, cell_size);
            }
        }

        // For visiblity
        this.canvas.style.display = 'block';


    }

    downloadEditedImage() {

        // Checking if there is an image
        if (!this.imageData) {

            alert("Please, upload an image first");
            return;
        }

        // Getting the image format from the URL
        const imageFormat = this.getImageFormat(this.canvas.toDataURL());
        const editedImageURL = this.canvas.toDataURL(`image/${imageFormat}`);

        // Create a download link for the edited image
        const downloadLink = document.createElement("a");

        // Setting the href attribute of the download link to the edited image's data URL
        downloadLink.href = editedImageURL;

        // Specifying the downloaded file's name
        downloadLink.download = "edited-image.png";

        // Download link
        downloadLink.click();

    }

    //Extracting the image format
    getImageFormat(imageType) {

        // The order should be considered
        if (!this.imageData) {

            alert("Please, upload an image first");
            return;
        }

        // Splitting the type string by '/' and take the second part as the format
        const parts = imageType.split('/');

        // Taking first part and returning it
        return parts[1];

    }

}

class DrawSpiral {

    constructor(editor) {

        this.editor = editor;
    }

    // ONE-LINE SQUARED SPIRAL
    spiral() {

        // Checking if there is image data
        if (!this.editor.imageData) {

            // If no image data, show an alert and exit the function
            alert("Please, upload an image first");
            return;
        }

        const canvas = this.editor.canvas;
        const ctx = canvas.getContext("2d");

        const bgColor = document.getElementById("bgColorSpiral").value;

        // Clearing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.style.backgroundColor = bgColor;

        // Defining size of each cell
        const cell_size = 5;

        // Defining needed variables for drawing the spiral
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let direction = 0;
        let step_cnt = 1;

        // Coming to directions (in clockwise), I defined 0 as right, 1 as down, 2 as left, and finally 3 as up

        while (step_cnt <= canvas.width && step_cnt <= canvas.height) {

            // Loop through the steps in the current direction
            for (let i = 0; i < step_cnt; i++) {

                // Calculating the pixel index
                const pixelIndex = (Math.floor(x) + Math.floor(y) * canvas.width) * 4;

                if (pixelIndex < this.editor.imageData.data.length) {

                    // Taking RGB color components from the image data
                    const red = this.editor.imageData.data[pixelIndex] / 255;
                    const blue = this.editor.imageData.data[pixelIndex + 1] / 255;
                    const green = this.editor.imageData.data[pixelIndex + 2] / 255;

                    // Calculating brightness as the sum of RGB components
                    const brightness = red + blue + green;

                    // Calculating line thickness based on brightness
                    // minimum = 1 and maximum = 5
                    const thickness = 5 - Math.max(brightness, 1);

                    // Setting the line thickness for drawing
                    ctx.lineWidth = thickness;

                    // Drawing a point according to direction
                    ctx.beginPath();
                    ctx.moveTo(x, y);

                    // Updating x and y based on the current direction
                    if (direction == 0) {

                        x += cell_size;
                    } else if (direction == 1) {

                        y += cell_size;
                    } else if (direction == 2) {

                        x -= cell_size;
                    } else if (direction == 3) {

                        y -= cell_size;
                    }

                    // Drawing line from the new position
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }

            // Updating direction
            direction = (direction + 1) % 4;

            if (direction == 0 || direction == 2) {

                // Updating step size
                step_cnt += 1;
            }
        }

        // Displaying canvas
        canvas.style.display = 'block';
    }

    // Perfect Curved (Circle) Spiral
    // curvedSpiral() {

    //     // Checking if there is image data
    //     if (!this.editor.imageData) {
    //         // If no image data, show an alert and exit the function
    //         alert("Please, upload an image first");
    //         return;
    //     }

    //     const canvas = this.editor.canvas;
    //     const ctx = canvas.getContext("2d");

    //     const bgColor = document.getElementById("bgColorSpiral").value;

    //     // Clearing canvas
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     canvas.style.backgroundColor = bgColor;

    //     const centerX = canvas.width / 2;
    //     const centerY = canvas.height / 2;

    //     // Number of spirals to draw
    //     const numSpirals = 10;

    //     // Angular step
    //     const angleStep = 0.1;

    //     // Radius increment
    //     const radiusIncrement = 1;

    //     for (let spiral = 1; spiral <= numSpirals; spiral++) {

    //         let radius = 0;

    //         ctx.beginPath();

    //         for (let angle = 0; angle < Math.PI * 2 * spiral; angle += angleStep) {

    //             radius += radiusIncrement;
    //             const x = centerX + radius * Math.cos(angle);
    //             const y = centerY + radius * Math.sin(angle);

    //             // Calculating the pixel index
    //             const pixelIndex = (Math.floor(x) + Math.floor(y) * canvas.width) * 4;

    //             if (pixelIndex < this.editor.imageData.data.length) {

    //                 // Taking RGB color components from the image data
    //                 const red = this.editor.imageData.data[pixelIndex] / 255;
    //                 const blue = this.editor.imageData.data[pixelIndex + 1] / 255;
    //                 const green = this.editor.imageData.data[pixelIndex + 2] / 255;

    //                 // Calculating brightness as the sum of RGB components
    //                 const brightness = red + blue + green;

    //                 // Calculating line thickness based on brightness
    //                 // minimum = 1 and maximum = 5
    //                 const thickness = 5 - Math.max(brightness, 1);

    //                 // Setting the line thickness for drawing
    //                 ctx.lineWidth = thickness;

    //                 // Draw a point
    //                 ctx.lineTo(x, y);
    //             }
    //         }

    //         ctx.stroke();
    //     }

    //     // Displaying canvas
    //     canvas.style.display = 'block';
    // }

}