// // MQTT HiveMQ Cloud
// const client = mqtt.connect("wss://d3b620a77b6b4436a805011e8d7aaaf0.s1.eu.hivemq.cloud:8884/mqtt", {
//   username: "admin",
//   password: "Admin@123"
// });

// // Topics
// const topicCmd       = "esp/control";
// const topicStatus  = "esp/status";
// const topicArduino   = "esp/arduino/data";

// // DOM elements
// const statusEl = document.getElementById("systemStatus");
// const feedbackEl = document.getElementById("feedbackList");

// // Color counters
// let countXanh = 0, countDo = 0, countVang = 0;

// // Connect & subscribe
// client.on('connect', () => {
//   console.log("Connected to MQTT");
//   statusEl.textContent = "Đã kết nối broker";
//   client.subscribe(topicArduino);
//   client.subscribe(topicStatus);
// });

// // Handle incoming messages
// client.on('message', (topic, message) => {
//   const msg = message.toString();

//   if(topic === topicStatus){
//     statusEl.textContent = msg;
//   } 
//   else if(topic === topicArduino){
//     try{
//       const data = JSON.parse(msg);
//       console.log(data)
//       if(data.col){
//         if(data.col === "Xanh") countXanh++;
//         else if(data.col === "Do") countDo++;
//         else if(data.col === "Vang") countVang++;

//         document.getElementById("countXanh").textContent = `Xanh: ${countXanh}`;
//         document.getElementById("countDo").textContent = `Đỏ: ${countDo}`;
//         document.getElementById("countVang").textContent = `Vàng: ${countVang}`;
//       }
//     } catch(e){
//     console.log(e)
//     }
//   }
  
// });

// // Send command
// function sendCmd(cmd){
//   client.publish(topicCmd, cmd);
// }


const socket = io("http://localhost:3000");
const statusEl = document.getElementById("systemStatus");

socket.on("mqtt_status", (data) => {
  console.log("MQTT STATUS:", data);
 
  // ví dụ hiển thị UI

  statusEl.innerText = `MQTT: ${data.status}`;
});

socket.on("mqtt_message", (topic, msg) => {
  if (topic === "esp/status") {
    statusEl.textContent = msg;
  }

  else if (topic === "esp/arduino/data") {
    try {
      const data = JSON.parse(msg);  // msg phải là JSON string
      console.log(data);

      if (data.col) {
        if (data.col === "Xanh") countXanh++;
        else if (data.col === "Do") countDo++;
        else if (data.col === "Vang") countVang++;

        document.getElementById("countXanh").textContent = `Xanh: ${countXanh}`;
        document.getElementById("countDo").textContent = `Đỏ: ${countDo}`;
        document.getElementById("countVang").textContent = `Vàng: ${countVang}`;
      }
    } catch (err) {
      console.error("JSON parse error:", err, msg);
    }
  }
});

