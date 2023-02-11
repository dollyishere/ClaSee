import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ExceptionEvent,
  OpenVidu,
  Session,
  SignalEvent,
  StreamEvent,
  StreamManager,
} from 'openvidu-browser';

import {
  Phone,
  Message,
  PanTool,
  Monitor,
  Videocam,
  Mic,
} from '@mui/icons-material';

import { useRecoilValue } from 'recoil';
import useViewModel from '../viewmodels/VideoCallViewModel';
import UserVideo from '../components/UserVideo';
import ChatBox from '../components/ChatBox';

import { Device, Msg, ConnectionError } from '../types/OpenviduType';
import PrivateInfoState from '../models/PrivateInfoAtom';

const VideoCallPage = () => {
  const userInfo = useRecoilValue(PrivateInfoState);
  // 사용자가 강사인지 수강생인지 url로 넘겨받도록 함
  // 이 부분은 로그인시 얻은 데이터로 나중에 바꿔야 돼요
  const location = useLocation();
  const role = location.pathname.split('/')[3];

  // 수강생 화면을 클릭했는지
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // 내가 손을 들었는지
  const [isHanded, setIsHanded] = useState<boolean>(false);

  // 손든 수강샌들의 이름을 저장하는 state
  const [raiseHand, setRaiseHand] = useState<Array<StreamManager>>([]);

  // 채팅창을 보이게 할 지
  const [isChatBoxVisible, setChatBoxVisible] = useState<boolean>(false);

  // OpenVidu 객체를 저장할 state
  const [OV, setOV] = useState<OpenVidu | null>(null);

  // 현재 세션 ID를 저장할 state => 스케줄 id
  // 이 부분도 실제 스케줄 id로 바꿔야 돼요 일단 지금은 url로 넘겨받음
  const [sessionId, setSessionId] = useState<string>(
    location.pathname.split('/')[2],
  );

  // 세션 객체를 저장할 state
  const [session, setSession] = useState<Session>();

  // 강사 화면 stream을 관리할 streamManager
  const [teacherStreamManager, setTeacherStreamManager] =
    useState<StreamManager>();

  // 학생 화면 stream을 관리할 streamManager
  const [studentStreamManager, setStudentStreamManager] =
    useState<StreamManager>();

  // 세션 참여자들의 streamManager를 저장할 state (배열)
  const [subscribers, setSubscribers] = useState<Array<StreamManager>>([]); // 세션 참여자

  // 현재 사용하는 캠 디바이스를 저장할 state
  // 이건 나중에 카메라 변경 기능 구현할 때 건드립니다.
  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device>();

  // 채팅 메시지를 저장할 state (배열)
  const [messages, setMessages] = useState<Array<Msg>>([]);

  // viewModel의 함수들
  // getToken은 서버로부터 세션 토큰을 받아옴
  // chat은 메시지 전송
  const { createSession, createToken, chat } = useViewModel();

  // 손들기 시그널 보내는 함수
  const sendRaiseHandSignal = () => {
    if (session !== undefined && userInfo !== null) {
      session
        .signal({
          data: userInfo.nickname,
          to: [],
          type: 'raiseHand',
        })
        .then(() => {
          console.log('raiseHand');
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  // 손 내리기 시그널 보내는 함수
  const sendDownHandSignal = () => {
    if (session !== undefined && userInfo !== null) {
      session
        .signal({
          data: userInfo.nickname,
          to: [],
          type: 'downHand',
        })
        .then(() => {
          console.log('downHand');
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  // 세션에서 나간 사람을 subscribers에서 제거
  const deleteSubscriber = (streamManager: StreamManager) => {
    // 세션에서 나간 사람의 데이터
    const data = JSON.parse(streamManager.stream.connection.data);

    // 나간 사람이 학생이면 subscribers에서 제거
    if (data.role === 'student') {
      const newSubscribers = subscribers;
      const index = newSubscribers.indexOf(streamManager, 0);

      if (index > -1) {
        newSubscribers.splice(index, 1);
        setSubscribers([...newSubscribers]);
      }

      // 나간 사람이 강사면 teacherStream에서 제거
    } else if (data.role === 'teacher') {
      setTeacherStreamManager(undefined);
    }

    const newRaiseHand = raiseHand;
    const index = newRaiseHand.indexOf(streamManager);
    if (index > -1) {
      newRaiseHand.splice(index, 1);
      setRaiseHand([...newRaiseHand]);
    }
  };

  // 세션에서 나갈 때 실행하는 함수
  const leaveSession = async () => {
    // 세션 연결을 끊음
    session?.disconnect();

    // 화상 통화와 관련된 state 초기화
    setOV(null);
    setSubscribers([]);
    setSession(undefined);
    setStudentStreamManager(undefined);
    setTeacherStreamManager(undefined);
  };

  // beforeunload 이벤트 발생시 실행할 함생
  // beforeunload 이벤트는 사용자가 페이지를 떠나기 직전에 발생
  const onbeforeunload = () => {
    leaveSession();
  };

  // 세션에 참가하기 위해 실행하는 함수
  const joinSession = () => {
    // OpenVidu 객체 생성
    const newOV = new OpenVidu();

    // 콘솔 창에 log 안뜨게 하는 mode임
    newOV.enableProdMode();

    // 세션 초기화
    const newSession = newOV.initSession();

    // OpenVidu 객체와 세션을 state로 저장
    setOV(newOV);
    setSession(newSession);

    // OpenVidu 연결 함수
    const connection = async () => {
      // 다른 사용자가 들어와서 stream이 생성된 streamCreated 이벤트
      newSession.on('streamCreated', (event: StreamEvent) => {
        // 세션에 들어온 사용자 정보
        const subscriber = newSession.subscribe(event.stream, undefined);
        const data = JSON.parse(subscriber.stream.connection.data);

        // 학생이면 subscribers state에 추가
        if (data.role === 'student') {
          const newSubscribers = subscribers;

          newSubscribers.push(subscriber);

          setSubscribers([...newSubscribers]);
        } else {
          // 선생이면 teacherstreamManager에 추가
          setTeacherStreamManager(subscriber);
        }
        const newMessages = messages;
        newMessages.push({
          message: `${data.clientData}님이 참가하셨습니다.`,
          from: data.clientData,
          role: data.role,
        });
        setMessages([...newMessages]);
      });

      // 다른 사용자가 나가서 stream이 제거된 streamDestroyed 이벤트
      newSession.on('streamDestroyed', (event: StreamEvent) => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        const data = JSON.parse(subscriber.stream.connection.data);
        // state에서 제거
        deleteSubscriber(event.stream.streamManager);
        const newMessages = messages;
        newMessages.push({
          message: `${data.clientData}님이 나가셨습니다.`,
          from: data.clientData,
          role: data.role,
        });
        setMessages([...newMessages]);
      });

      // 예외가 발생한 경우
      newSession.on('exception', (exception: ExceptionEvent) => {
        // 콘솔에 예외 표시
        console.warn(exception);
      });

      // 다른 사용자가 메시지를 전송한 이벤트
      newSession.on('signal:chat', (event: SignalEvent) => {
        if (event.from !== undefined && event.data !== undefined) {
          // 메시지 객체 생성
          const message = {
            message: event.data,
            from: JSON.parse(event.from.data).clientData,
            role: JSON.parse(event.from.data).role,
          };

          // 메시지 state 배열에 추가
          const newMessages = messages;
          newMessages.push(message);
          setMessages([...newMessages]);
        }
      });

      // 누가 손을 들었을 때
      newSession.on('signal:raiseHand', (event: SignalEvent) => {
        if (event.from !== undefined && event.from.stream !== undefined) {
          const newRaiseHand = raiseHand;

          newRaiseHand.push(event.from.stream.streamManager);
          setRaiseHand([...newRaiseHand]);
        }
      });

      // 누가 손을 내렸을 때
      newSession.on('signal:downHand', (event: SignalEvent) => {
        if (event.from !== undefined && event.from.stream !== undefined) {
          const newRaiseHand = raiseHand;

          const index = newRaiseHand.indexOf(
            event.from.stream.streamManager,
            0,
          );

          if (index > -1) {
            newRaiseHand.splice(index, 1);
            setRaiseHand([...newRaiseHand]);
          }
        }
      });
      if (userInfo !== null) {
        // 세션 토큰 api 요청 함수
        const { testId, testToken } = await createSession(
          userInfo.email,
          sessionId,
        );
        createToken(testId, testToken).then((token: string) => {
          // 해당 토큰으로 세션 연결
          newSession
            .connect(token, { clientData: userInfo.nickname, role })
            .then(async () => {
              // 비디오stream 생성
              const newPublisher = await newOV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x360',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
              });

              // 세션에 stream을 publish
              newSession.publish(newPublisher);

              // 컴퓨터와 연결된 디바이스 정보
              const devices = await newOV.getDevices();

              // 디바이스들 중 videoinput device를 찾음
              /*
                {
                deviceId, kind, label
                }
              */
              const videoDevices = devices.filter(
                (device: Device) => device.kind === 'videoinput',
              );

              // 현재 스트림에서 사용하고 있는 캠 deviceId
              const currentVideoDeviceId = newPublisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;

              // 컴퓨터와 연결된 디바이스 정보 중에서 현재 사용하고 있는 캠 정보를 가져옴
              const newCurrentVideoDevice = videoDevices.find(
                (device: Device) => device.deviceId === currentVideoDeviceId,
              );

              // currentVideoDevice state를 현재 사용하고 있는 캠 정보로 저장
              setCurrentVideoDevice(newCurrentVideoDevice);

              // role이 강사면 스트림을 teacherStreamManager에 저장
              if (role === 'teacher') {
                setTeacherStreamManager(newPublisher);
              } else {
                // role이 학생이면 스트림을 studentStreamManager에 저장
                setStudentStreamManager(newPublisher);
              }
            })
            .catch((error: ConnectionError) => {
              console.log('Error', error.code, error.message);
            });
        });
      }
    };
    // 연결
    connection();
  };

  // 페이지를 벗어나기 직전 onbeforeunload 이벤트 실행하도록 이벤트리스너에 등록
  window.addEventListener('beforeunload', onbeforeunload);

  // 마운트, 언마운트시 실행할 함수들
  useEffect(() => {
    if (!OV) {
      // 마운트시 세션에 참여하는 함수 실행
      joinSession();

      if (role === 'student') {
        setIsFocused(true);
      }
    }
    return () => {
      // 혹시 모를 에러를 방지하기 위해 이벤트리스너 제거
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  // 학생 비디오를 클릭했을 때 실행할 함수
  const handleVideoClick = (streamManager: StreamManager | null) => {
    // argument가 null이면 선택된 학생 화면을 원래대로 되돌리도록 동작
    if (streamManager === null || streamManager === studentStreamManager) {
      setStudentStreamManager(undefined);
    } else {
      // null이 아니면 subscribers에서 찾아서 화면을 focus하도록 동작
      const newSubscribers = subscribers;
      const index = newSubscribers.indexOf(streamManager);

      if (index > -1) {
        setStudentStreamManager(streamManager);
      }
    }
    // isFocused를 반대로
    setIsFocused((prev: boolean) => !prev);
  };

  // 채팅창 토글 함수
  const toggleChatBox = () => {
    setChatBoxVisible((prev: boolean) => !prev);
  };

  // 손 들기 버튼 클릭했을 때 실행할 함수
  const handleHandClick = () => {
    if (session !== undefined) {
      // 손을 들지 않은 상태라면 손 들었다는 signal 보내고 손을 든 상태로 세팅
      if (!isHanded) {
        sendRaiseHandSignal();
      } else {
        sendDownHandSignal();
      }
      setIsHanded((prev: boolean) => !prev);
    }
  };

  return (
    <div className="page video-call-page">
      {/* 채팅창을 제외한 메인 컨텐츠 영역 */}
      <div className="video-call-page__content">
        {/* 헤더, 이 부분에는 강의 진행 상황을 표시할 그래프가 있어야 합니다. */}
        <div className="video-call-page__header">헤더</div>
        {/* 비디오 화면들이 표시되는 영역 */}
        <div className="video-call-page__videos">
          {/* isFocused가 true이면 선택한 학생 하나만 왼쪽 화면에 표시하고 나머지는 밑으로 내림 */}
          <div className="video-call-page__video--students-left">
            {isFocused ? (
              <div className="video-call-page__video--student">
                <div
                  role="presentation"
                  className="video-call-page__student-stream-container"
                  onClick={() => handleVideoClick(null)}
                >
                  <UserVideo streamManager={studentStreamManager} />
                </div>
              </div>
            ) : (
              /* isFocused가 false이면 왼쪽 화면에 학생들의 화면 표시 */
              <div className="video-call-page__video--students-group">
                {/* 열을 3개로 나눠서 피그마대로 표시 */}
                <div className="video-call-page__video--students-col">
                  {subscribers.map((sub: StreamManager, i: number) =>
                    i % 3 === 1 ? (
                      <div
                        role="presentation"
                        className="video-call-page__stream-container"
                        onClick={() => handleVideoClick(sub)}
                      >
                        <UserVideo streamManager={sub} />
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="video-call-page__video--students-col">
                  {subscribers.map((sub: StreamManager, i: number) =>
                    i % 3 === 0 ? (
                      <div
                        role="presentation"
                        className="video-call-page__stream-container"
                        onClick={() => handleVideoClick(sub)}
                      >
                        <UserVideo streamManager={sub} />
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="video-call-page__video--students-col">
                  {subscribers.map((sub: StreamManager, i: number) =>
                    i % 3 === 2 ? (
                      <div
                        role="presentation"
                        className="video-call-page__stream-container"
                        onClick={() => handleVideoClick(sub)}
                      >
                        <UserVideo streamManager={sub} />
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 강사의 화면을 표시하는 영역 */}
          <div className="video-call-page__video--teacher">
            <div className="video-call-page__teacher-stream-container">
              {teacherStreamManager !== undefined ? (
                <UserVideo streamManager={teacherStreamManager} />
              ) : null}
            </div>
          </div>
          {isFocused ? (
            /* isFocused가 true이면 왼쪽에 선택된 학생의 화면을 표시하고 아래에는 나머지 학생 화면 표시 */
            <div className="video-call-page__video--students-bottom">
              {subscribers.map((sub: StreamManager) =>
                studentStreamManager !== sub ? (
                  <div className="video-call-page__stream-container">
                    <UserVideo streamManager={sub} />
                  </div>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
        {/* 화상통화에 사용하는 각종 기능 버튼들을 배치할 푸터 */}
        <div className="video-call-page__footer">
          <div className="video-call-page__buttons">
            {/* 손들기 버튼 */}
            <button
              type="button"
              className="video-call-page__button"
              onClick={handleHandClick}
            >
              <PanTool style={{ fontSize: '30px' }} />
            </button>
            {/* 음소거 버튼 */}
            <button type="button" className="video-call-page__button">
              <Mic fontSize="large" />
            </button>
            {/* 화면공유 버튼 */}
            <button type="button" className="video-call-page__button">
              <Monitor fontSize="large" />
            </button>
            {/* 캠 변경 버튼 */}
            <button type="button" className="video-call-page__button">
              <Videocam fontSize="large" />
            </button>
            {/* 나가기 버튼 */}
            <button
              type="button"
              className="video-call-page__button video-call-page__button--quit"
              onClick={window.close}
            >
              <Phone fontSize="large" />
            </button>

            {/* 채팅창 토글 버튼 */}
            <button
              type="button"
              className="video-call-page__button video-call-page__button--msg"
              onClick={toggleChatBox}
            >
              <Message fontSize="large" />
            </button>
          </div>
          <div className="video-call-page__hands">
            {raiseHand.map((hand: StreamManager) => (
              <div
                role="presentation"
                key={JSON.parse(hand.stream.connection.data).clientData}
                className="video-call-page__hand"
                onClick={() => handleVideoClick(hand)}
              >
                <div>
                  <PanTool />
                </div>
                <div>{JSON.parse(hand.stream.connection.data).clientData}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isChatBoxVisible && userInfo !== null ? (
        // isChatBoxVisible이 true이면 채팅창 보이게 하기
        <ChatBox
          toggleChatBox={toggleChatBox}
          chat={chat}
          session={session}
          messages={messages}
          setMessages={setMessages}
          userName={userInfo.nickname}
          role={role}
        />
      ) : null}
    </div>
  );
};

export default VideoCallPage;
