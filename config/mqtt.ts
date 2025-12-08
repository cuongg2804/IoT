// src/services/mqttService.ts
import mqtt, { MqttClient } from "mqtt";
import { Server } from "socket.io";

let client: MqttClient;

export const initMqtt = (io: Server) => {
  client = mqtt.connect(`${process.env.mqtt_server}`, {
    username: `${process.env.mqtt_username}` ,
    password: `${process.env.mqtt_password}`,
  });
  
  client.on("connect", () => {
    io.emit("mqtt_status", {
      status: "connected",
      message: "MQTT Broker connected successfully"
    });
    console.log("MQTT connected");
    // Subscribe cố định
    client.subscribe("esp/status");
    client.subscribe("esp/arduino/data");
  });

  // Nhận message → gửi sang FE qua Socket.io
  client.on("message", (topic: string, message: Buffer) => {
    const msg = message.toString();
    
    io.emit("mqtt_message", { topic, msg });
  });

  client.on("error", (err) => {
    console.error("MQTT Error:", err);
  });

  client.on("offline", () => {
    console.warn("MQTT Offline");
  });

  client.on("reconnect", () => {
    console.log("MQTT Reconnecting...");
  });

  io.on("connection", (socket) => {
    socket.on("send_cmd", (cmd: string) => {
      console.log("CMD from FE:", cmd);
      publishCommand(cmd);
    });
  });
};

// Publish lệnh cho ESP
export const publishCommand = (cmd: string) => {
  client.publish("esp/control", cmd);
};

// Subscribe động
export const subscribeTopic = (topic: string) => {
  client.subscribe(topic);
  console.log("Subscribed to:", topic);
};


export const getClient = () => client;