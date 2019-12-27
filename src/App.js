import React, { useRef, useCallback, useState } from "react";
import produce from "immer";
const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null
  });

  // input 수정을 위한 함수
  const onChange = useCallback(e => {
    const { name, value } = e.target;

    // v1
    // setForm({
    //   ...form,
    //   [name]: [value]
    // });

    //v2
    // setForm(
    //   produce(form, draft => {
    //     draft[name] = value;
    //   })
    // );

    //v3 굳이 form을 넣을 필요 없이 function을 넣어서 사용 가능.
    // 예를 들어 setNumber처럼 안에 func을 넣어보자
    // const [number, setNumber] = useState(0);
    //const onIncrease = useCallback(() => setNumber(prevNumber => prevNumber + 1), []);
    setForm(
      produce(draft => {
        console.log("onChange", draft[name]);
        draft[name] = value;
      })
    );
    // v2까지는 dep에 form이 있었음.
  }, []);

  // form 등록을 위한 함수
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username
      };

      // array에 항목 등록
      // v1
      // setData({
      //   ...data,
      //   array: data.array.concat(info)
      // });

      //v2
      // setData(
      //   produce(data, draft => {
      //     draft.array.push(info);
      //   })
      // );

      // v3
      setData(
        produce(draft => {
          console.log("onSubmit", draft, draft.array);
          draft.array.push(info);
        })
      );

      // form 초기화
      setForm({
        name: "",
        username: ""
      });
      nextId.current += 1;
    },
    // 마찬가지로 v2까지 data가 있었음.
    [form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback(id => {
    // v1
    // setData({
    //   ...data,
    //   array: data.array.filter(info => info.id !== id)
    // });

    // v2
    // setData(
    //   produce(data, draft => {
    //     draft.array.splice(
    //       draft.array.findIndex(info => info.id === id),
    //       1
    //     );
    //   })
    // );

    // v3
    setData(
      produce(draft => {
        console.log("onRemove", draft, draft.array);
        draft.array.splice(
          draft.array.findIndex(info => info.id === id),
          1
        );
      })
    );
    // 여기도 마찬가지로 data가 v2까지 있었음
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
