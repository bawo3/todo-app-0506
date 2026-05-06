# Todo 앱

바닐라 JavaScript로 만든 심플한 할 일 관리 앱입니다.  
빌드 도구나 패키지 설치 없이 `index.html`을 브라우저에서 바로 열면 실행됩니다.

## 실행 방법

```
index.html 파일을 더블클릭하거나 브라우저로 열면 바로 사용할 수 있습니다.
```

## 주요 기능

- 할 일 추가 (입력 후 `추가` 버튼 클릭 또는 `Enter` 키)
- 체크박스로 완료 처리
- 개별 항목 삭제
- 완료된 항목 전체 삭제
- 탭 필터링: **전체 / 진행중 / 완료**
- 탭 뱃지로 각 상태별 개수 표시
- 새로고침해도 데이터 유지 (localStorage 저장)

## 파일 구조

```
todo-app/
├── index.html   # 정적 마크업
├── app.js       # 전체 로직 (상태 관리, 이벤트, 렌더링)
└── style.css    # 스타일
```

## 기술 스택

- HTML / CSS / JavaScript (순수 바닐라, 프레임워크 없음)
- localStorage (데이터 영구 저장)

## 데이터 구조

할 일 항목은 아래 형태로 localStorage에 JSON으로 저장됩니다.

```json
{
  "id": 1715000000000,
  "text": "할 일 내용ggggggggggg",
  "completed": false
}
```
