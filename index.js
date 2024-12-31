const express = require('express');
const { exec } = require('child_process');


const app = express();
const port = 4200;

app.use(express.json());

app.post("/webhook/phaohathuy", (req, res) => {
    console.log("THIS CALL");
  const imageName = "tuilanguyencuong/phaohathuy";
  const container = "phaohathuy-container";

  const pullImage = `docker pull ${imageName}`;
  const checkExistContainer = `docker ps -a -q -f name=${container}`;
  const removeContainer = `docker rm -f ${container}`;

  const runContainerContainImage = `docker run -d -p 3000:3000 --name ${container} ${imageName}`;

  const excuteCMD = (command) => {
    return new Promise((resolve, reject) => {
      
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error when excute command: ${command} ${err} `);
        }
        console.log(`Command executed: ${command}`, stdout);
        resolve(stdout.trim());
      });
    });
  };

  //EXCUTE DOCKER COMMAND !!!


  (
    async () => {
        try {
            console.log("Excute begin !!");
          await excuteCMD(pullImage);
          console.log('Image pulled successfully 1');
          const containerExists = await excuteCMD(checkExistContainer);
          if (containerExists) {
            await excuteCMD(removeContainer);
            console.log('Existing container removed successfully (2)');
          }
          await excuteCMD(runContainerContainImage);
          console.log('Container is running successfully last (3)');
    
          res.status(200).send("Webhook executed successfully");
        } catch (error) {
            console.error('Error during webhook execution:', error);
    
          res.status(500).send("Error excuting webhook");
        }
      }
  )();
});

app.listen(port,()=>{
    console.log("Webhook server is running on port ",port);
})
