import { onMount, createSignal, JSX, Show } from 'solid-js'

interface DemoSectionProps {
  title: string
  icon: string
  description: string
  children: JSX.Element
}

export default function DemoSection(props: DemoSectionProps) {
  const [visible, setVisible] = createSignal(false)
  let sectionRef: HTMLDivElement | undefined

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef) {
      observer.observe(sectionRef)
    }
  })

  return (
    <Show when={visible()} fallback={<div ref={sectionRef} class="demo-section-enter" style={{ height: '200px' }} />}>
      <section ref={sectionRef} class="demo-section demo-section-enter demo-section-visible">
        <div class="demo-section-header">
          <span class="demo-section-icon">{props.icon}</span>
          <div>
            <h2 class="demo-section-title">{props.title}</h2>
            <p class="demo-section-description">{props.description}</p>
          </div>
        </div>
        <div class="demo-section-content">
          {props.children}
        </div>
      </section>
    </Show>
  )
}
