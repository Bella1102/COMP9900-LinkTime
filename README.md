## COMP9900-LinkTime(20T1)
## Accommodation Booking Web Portal


### 1. Install Frontend Environment and Run Frontend

If node or npm is not installed on your computer, please check this [Website](https://nodejs.org/en/) for node installation.

After installing the node environment, open your command console, execute the following command in the folder where the project is located to start the frontend.

```bash
    cd Frontend 
    yarn install
    yarn start
```
Open your browser and visit: [http://localhost:3000](http://localhost:3000). You will see the homepage of this project.
  

### 2. Install Backend Environment and Run Backend

You can create a virtual env with conda [recommended].  
If conda is not installed on your computer, please check this [Website](https://docs.conda.io/projects/conda/en/latest/user-guide/install/) for conda installation.  
After installing conda, execute the following command to create and activate a virtual environment.
```bash
    conda create -n COMP9900 python=3.7
    conda activate COMP9900
```
This method creates a space in which the backend can run without clashing with any other python packages and issues on your local machine. If you don't care, you can run the backend in the global space as such.
```bash
    cd Backend
    pip3 install -r requirements.txt
    python3 run.py
```
Open your browser and visit: [http://localhost:5000](http://localhost:5000). You will see the backend docs of this project.

If you want to exit the virtual environment, execute the following code.

```bash
    conda deactivate
```

To make sure everything is working correctly, we strongly suggest you read the instructions in both Backend and Frontend, and try to start both servers(Frontend and Backend).

#### Quick start
You can login with the following user info.
```bash
    1. Username: 'Link', Password: '123123'
    2. Username: 'Lin',  Password: '123123'
```

### 3. Source Code Navigation

You can view **Frontend** source code in the editor like Sublime or VSCode.

```bash
src:                  # The main code folder
    > common          # Header and Footer component
    > pages           # All frontend pages
    > redux           # Redux data warehouse
    > style           # Default CSS style
    > utils           # Help functions
    - App.js          # Route settings for website
    - admin.js        # Combine Header, Page contents, Footer
    - index.js        # The main entrypoint
```

You can view **Backend** source code in the editor like Sublime or VSCode.

```bash
    > apis              # All api code
    > db                # Initialization code and data
    > utils             # API models and help functions
    > uploads           # All upload pictures
    - requirement.txt   # Relevant Python packages
    - run.py            # The entrypoint for backend
```



