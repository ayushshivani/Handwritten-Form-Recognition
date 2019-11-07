# Form Template Marker For Document Scanning 

This is an end to end application to automate the process of manual feeding in data from a form into the database. Instead of manually typing each and every data of every form, now the user can just click a picture of the form, upload it on our web app and the data is automatically stored into the database with each data into their respective field.

The document scanning project involves
 - Marking The Template from an Empty Form
 - Registration of Form Template with the Filled Form
 - Extraction of Fields from Filled Form
 - Breaking of Fields into Boxes each consisting of Character
 - Character Recognition from the Box Image
 - Storing the translated data into the Database

> From Thousand Clicks to One Click

# Requirements
The application uses the following modules:
 - Flask
 - Numpy
 - OpenCV
 - SQLAlchemy

To install the packages run the following commands:
```
$ pip install -r requirements
```

# How to Run
To run, clone the directory, make sure all the required packages are installed, then type the following commands, inside the cloned directory:
```
$ cd template-marker
$ python3 flask_app.py
```
This hosts the backend flask server in the localserver port 8080.
Now run the following command
```
$ cd react-app
$ yarn
$ yarn start
```

# Pipeline

### Login/Signup
The user can Signup or Login with the credentials:
Username : admin
Password : admin

### Marking Template
Next the user should Mark the Template by selecting the Mark Template option in the navigation bar.
To mark the the template, one has to fulfil the following steps:
 - Upload the Empty Form Image
 - Mouse Left click on the form to make a draggable rectangle appear
 - Resize and drag the rectangle by clicking on the rectangle sides and moving the cursor, such that it traces the field borders
 - Click on the green button to lock the rectangle position and enter the respective field name, optional field description, the field type (text,checkbox,signature) and submit it
 - To edit any marked field just press on the orange button to unlock it and make changes
 - To delete a field press the red button along the rectangle
 - After marking all the fields enter the template name and optional description and submit the template

### Get Data
Now to get the data of a filled form, make sure that its template is already marked by the user. Then select the Get Data option from the navigation bar and fulfil the following steps:
 - Select the template that the filled form corresponds to
 - Upload the image of the filled form and press submit
 - Wait for the prompt of succesful submit
 - Now Go to previous templates option in the nav bar and press the show data button for the corresponding form to check the translated data

### For Developers
Some Useful Tips and Information regarding the pipeline intermediates:
 - The Uploaded Empty Form is stored in the `./react-app/public/templates` folder with name corresponding to the template id
 - The Uploaded Filled Form for getting data is stored in `./react-app/public/templates` folder with the name corresponding to the template id + " form"
 - The registered image is stored as `finalimage.png` in the `./react-app/public/temp` folder
 - The extracted boxes are stored in the `./react-app/public/temp/blocks` folder with name corresponding to the field id along with the box number

License
-------