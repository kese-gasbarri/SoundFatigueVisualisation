from fetcher import FakeFetcher
import time


def handle_resp(resp):
    print(resp)
to_fetch = [(0, 1), (1, 0)]
def main():
    fetch = FakeFetcher(handle_resp, to_fetch, 2, "http://127.0.0.1:8001")
    fetch.start()
    while True:
        time.sleep(1) 


if __name__ == "__main__":
    main()