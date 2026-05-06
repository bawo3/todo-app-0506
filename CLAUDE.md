# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 코딩 정책

- 모든 주석은 반드시 한국어로 작성한다.
- 모든 답변과 코드 설명은 초보자도 이해할 수 있는 쉬운 한국어로 작성한다.

## 프로젝트 개요

빌드 도구나 패키지 매니저 없이 동작하는 순수 바닐라 JS Todo 앱이다.  
`index.html`을 브라우저에서 직접 열면 실행된다. 서버 구동이 필요하지 않다.

## 아키텍처

프레임워크 없이 3개 파일로 구성된다.

- **`app.js`** — 유일한 로직 파일. 전역 상태(`todos` 배열, `currentFilter` 문자열)를 직접 관리한다.  
  데이터 변경 함수(`addTodo`, `toggleTodo`, `deleteTodo`, `clearCompleted`)는 모두 `saveTodos()` → `render()` 순서로 호출하여 상태 저장과 화면 갱신을 함께 처리한다.  
  목록 클릭은 이벤트 위임(`#todoList` 단일 리스너)으로 처리한다.

- **`style.css`** — 레이아웃과 컴포넌트 스타일. BEM 없이 단순 클래스명 사용(`.todo-item`, `.filter-btn`, `.input-area` 등).

- **`index.html`** — 정적 마크업. JS는 `<body>` 끝에서 로드된다.

## 데이터 흐름

```
사용자 이벤트
  → 상태 변경 함수 (addTodo / toggleTodo / deleteTodo / clearCompleted)
  → saveTodos()  [localStorage에 JSON 직렬화]
  → render()     [DOM 전체 재생성]
```

`todos` 항목 구조: `{ id: number (Date.now()), text: string, completed: boolean }`

## 주의 사항

- `render()`는 `#todoList` 전체를 매번 새로 그린다. 성능 최적화가 필요하면 DOM diff 방식으로 교체해야 한다.
- `escapeHtml()`로 XSS를 방지한다. `innerHTML`에 사용자 입력을 넣을 때는 반드시 이 함수를 거쳐야 한다.
- `id`는 `Date.now()` 기반이라 동일 밀리초에 추가하면 충돌할 수 있다.


##index.html은 절대 수정하지 않는다.