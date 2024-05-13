import { useState } from "react";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

export const ReactWebSocket = () => {

    // WebSocket 연결
    const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8080/chatting/1");

    // session 아이디 저장용
    const [sessionId, setSessionId] = useState(0);

    // 메시지 이력 저장용
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
    
    const sendTestMessage = ()=>{
        // 연결된 웹소켓으로 메시지 전송
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