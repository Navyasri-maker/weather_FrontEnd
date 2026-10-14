import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const weatherResponse = {
  name: "Bengaluru",
  sys: { country: "IN" },
  weather: [{ description: "clear sky" }],
  main: {
    temp: 24,
    feels_like: 25,
    temp_max: 27,
    temp_min: 19,
    humidity: 60,
    pressure: 1012,
  },
  wind: { speed: 3.5 },
  visibility: 10000,
};

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("shows the weather dashboard and popular cities", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /a little more sunshine/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /hyderabad/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/city name/i)).toBeInTheDocument();
});

test("searches for a city and can switch temperature units", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => weatherResponse,
  });
  render(<App />);

  fireEvent.change(screen.getByLabelText(/city name/i), {
    target: { value: "Bengaluru" },
  });
  fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

  expect(
    await screen.findByRole("heading", { name: /bengaluru/i })
  ).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:8080/weather/Bengaluru"
  );
  expect(screen.getByText("24", { exact: true })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /switch to degrees fahrenheit/i }));
  await waitFor(() => expect(screen.getByText("75", { exact: true })).toBeInTheDocument());
});

test("shows an error when the city is not found", async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 404 });
  render(<App />);

  fireEvent.change(screen.getByLabelText(/city name/i), {
    target: { value: "Not a real city" },
  });
  fireEvent.click(screen.getByRole("button", { name: /get weather/i }));

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent(/couldn't find that city/i);
});
