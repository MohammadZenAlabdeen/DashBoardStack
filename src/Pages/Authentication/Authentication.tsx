import { Outlet } from "react-router-dom"
import styles from './styles.module.css'

const Authentication = () => {
  return (
    <div className={styles.container}>
        <img  id={styles.bg} src='/assets/pngs/auth-bg.png'/>
        <Outlet/>
    </div>
  )
}

export default Authentication