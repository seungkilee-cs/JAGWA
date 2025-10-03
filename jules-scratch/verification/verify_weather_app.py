from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the app
            page.goto("http://localhost:4173", timeout=30000)

            # Wait for the main weather display to be visible, indicating data has loaded
            weather_display = page.locator(".weather-display")
            expect(weather_display).to_be_visible(timeout=20000)

            # Also wait for one of the new components to ensure the full UI is rendered
            uv_index_display = page.locator(".uvi-display")
            expect(uv_index_display).to_be_visible(timeout=10000)

            # Take a screenshot
            page.screenshot(path="jules-scratch/verification/verification.png")

            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            # In case of error, take a screenshot for debugging
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()