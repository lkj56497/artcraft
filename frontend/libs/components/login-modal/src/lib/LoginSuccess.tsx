import { CheckIcon } from "lucide-react";
import styles from "./LoginSuccess.module.css";

export function LoginSuccess({ username }: { username: string }) {
  return (
    <div className={styles.panel} role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.badge} aria-hidden="true">
        <CheckIcon size={28} strokeWidth={2} />
      </div>
      <h2 className={styles.heading}>
        로그인 계정:{" "}
        <span className={styles.username}>{username}</span>
      </h2>
      <p className={styles.caption}>이제 만들 준비가 됐습니다.</p>
    </div>
  );
}
