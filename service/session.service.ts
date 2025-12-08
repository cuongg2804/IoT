import Session from "../model/session.model";

let currentSession: any = null;
let systemOn = false

// values từ ESP
let currentCounts = {
  "Do" : 0,
  "Vang" : 0,
  "Xanh" : 0
};
let lastColor: string | null = null;
let lastCount: number = 0;

export const startSession = async () => {
  if (currentSession) return;
  
  currentSession = await Session.create({
    startAt: new Date(),
    totalRed: 0,
    totalBlue: 0,
    totalGreen: 0,
    status: "running",
  });

  // reset RAM
  currentCounts = { "Do": 0, "Xanh": 0, "Vang": 0 };
  lastColor = null;
  lastCount = 0;

  console.log("Session started:", currentSession._id);
};




export const processData = (data: any) => {
  if (!currentSession) return;
  // Nếu nhận màu → chỉ lưu lại màu cuối
  const color = data.col.toString();
 

  // Nếu nhận số lượng và đã có màu trước đó
  
    if (color == "Do"){ currentCounts.Do +=1; };
    if (color == "Xanh") currentCounts.Xanh += 1;
    if (color == "Vang") currentCounts.Vang += 1;
  
  
  console.log(currentCounts)
};


export const stopSession = async () => {
  if (!currentSession) return;

  currentSession.endAt = new Date();
  currentSession.status = "stopped";

 
  currentSession.totalRed = currentCounts.Do;
  currentSession.totalBlue = currentCounts.Xanh;
  currentSession.totalGreen = currentCounts.Vang;

  await currentSession.save();

  console.log("Session saved:", currentSession._id);

  currentSession = null;
};
