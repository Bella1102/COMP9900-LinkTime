## COMP9900-LinkTime Backend
## Accommodation Booking Web Portal Frontend


#### Install Backend Environment and Run Backend

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

### Source Code Navigation

You can view **Backend** source code in the editor like Sublime or VSCode.

```bash
    Backend:
    > apis              # All api code
    > db                # Initialization code and data
    > utils             # API models and help functions
    > uploads           # All upload pictures
    - requirement.txt   # Relevant Python packages
    - run.py            # The entrypoint for backend
```


