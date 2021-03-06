export class SystemHelper {
  public static delay(timeout: number) {
    return new Promise((done) => setTimeout(done, timeout));
  }
}
