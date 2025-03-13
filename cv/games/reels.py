# games/reels.py
import cv2
import mediapipe as mp
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

NEUTRAL_THRESHOLD = 0.15
prev_status = "NEUTRAL"

def run_reels():
    # Browser Setup for Instagram Reels
    options = webdriver.ChromeOptions()
    options.add_experimental_option("detach", True)  # Keep browser open
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get("https://www.instagram.com/reels/")
    print("Opening Instagram Reels...")
    time.sleep(5)  # Wait for page to load

    # Camera & Gesture Control
    cap = cv2.VideoCapture(1)  # Adjust camera index if needed
    global prev_status
    while cap.isOpened():
        try:
            if len(driver.window_handles) == 0:
                print("Chrome window closed. Exiting...")
                break
        except Exception as e:
            print("Error checking Chrome window:", e)
            break
        
        ret, frame = cap.read()
        if not ret:
            break

        # Flip frame and convert color
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        result = hands.process(rgb_frame)
        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                wrist_y = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].y
                knuckle_avg_y = sum([hand_landmarks.landmark[i].y for i in [5, 9, 13, 17]]) / 4

                # Determine hand status based on threshold
                if abs(wrist_y - knuckle_avg_y) < NEUTRAL_THRESHOLD:
                    status = "NEUTRAL"
                elif wrist_y > knuckle_avg_y + NEUTRAL_THRESHOLD:
                    status = "UP"
                elif wrist_y < knuckle_avg_y - NEUTRAL_THRESHOLD:
                    status = "DOWN"

                # Control logic for Reels
                if prev_status == "NEUTRAL" and status == "UP":
                    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ARROW_DOWN)
                    print("Swipe Up detected! Next reel.")
                elif prev_status == "NEUTRAL" and status == "DOWN":
                    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ARROW_UP)
                    print("Swipe Down detected! Previous reel.")

                prev_status = status

                # Draw landmarks and display status on the frame
                cv2.putText(frame, f"Wrist: {status}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                #mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        #cv2.imshow("Reels Gesture Control", frame)
        #if cv2.waitKey(1) & 0xFF == ord('q'):
        #    break

    cap.release()
    cv2.destroyAllWindows()
    driver.quit()

if __name__ == '__main__':
    run_reels()