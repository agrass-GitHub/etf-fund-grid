import { defineComponent, ref } from 'vue'

export default defineComponent(() => {
  const state = ref(0)
  const onClick = () => {
    state.value++;
    console.log(state.value)
  }
  return () => (
    <div>
      <h3>state: {state.value}</h3>
      <button onClick={onClick}>点击</button>
    </div>
  )
})