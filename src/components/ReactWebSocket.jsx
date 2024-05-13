import { useState } from "react";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

export const ReactWebSocket = () => {
    const [sessionId, setSessionId] = useState(0);
    const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8080/chatting/1");
    const [messageHistory, setMessageHistory] = useState([]);
    const [msgList, setMsgList] = useState([]);

    //메시지에 대한 변화에 대해서 정의 합니다.
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => {  //기존 메시지에 데이터를 추가합니다.
                let msg = lastMessage ? lastMessage.data : null;
                if (msg) {
                    let object = JSON.parse(msg);
                    
                    if (object.type === "getId") {
                        setSessionId(object.sessionId);
                    } else if (object.type === "message") {
                        setMsgList((prev)=>[...prev, object]);
                    }
                }
                return prev.concat(lastMessage)
            });
        }
    }, [lastMessage, setMessageHistory]);

    useEffect(()=>{
        console.log(msgList);
    }, [msgList])
    
    const sendTestMessage = ()=>{        
        sendMessage(JSON.stringify({
            type: 'message',
            roomNumber: 1,
            sessionId: sessionId,
            userName: "홍길동",
            msg: "hi"
        }))
    }

    return (
        <>
            <button onClick={sendTestMessage}>테스트 전송</button>
            <hr/>
            {msgList.map((msg, idx)=>{
                return (
                msg.type === "message" ?
                <p key={"msg_"+idx}><span>{msg.userName}:</span> {msg.msg}</p>
                : <></>
                )
            })}
            <hr/>
        </>
    );
}