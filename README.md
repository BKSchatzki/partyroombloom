# PartyRoomBloom

## Description

PartyRoomBloom is an app for game masters of tabletop roleplaying games to develop their sessions through scene creation and iteration using generative AI. The Outline functionality is complete and being polished. Looking at reimplementing PDF, markdown, and JSON exports to allow users to self-manage / backup data. Prompt refinement and connection of Outline to Simulation is next step.

## Features

<!-- - Feature 1: Brief description of major functionality
- Feature 2: Another key feature of your application
- Feature 3: Additional important capability -->

## Technologies Used

<!-- - Technology 1
- Technology 2
- Technology 3 -->

<!-- ## Dependencies

```json
{
  "dependency1": "^1.0.0",
  "dependency2": "^2.0.0"
}
``` -->

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BKSchatzki/partyroombloom.git
   ```

2. Navigate to the project directory:

   ```bash
   cd partyroombloom
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory
2. Add required environment variables, also found in `.env.example`:

   ```env
   DATABASE_URL="Link to your PostgreSQL instance"
   OPENAI_URI="https://api.openai.com/v1/chat/completions"
   OPENAI_API_KEY="Your OpenAPI key"
   AUTH_GOOGLE_ID="Your Google Client ID"
   AUTH_GOOGLE_SECRET="Your Google Client secret"
   AUTH_GOOGLE_REDIRECT_URI="http://localhost:3000/login/google/callback"
   NPC_SERVICE="Currently under construction, will possibly be moved into this repo"
   ```

## Usage

Run dev server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Build Instructions

To build the project for production:

```bash
npm run build
```

<!-- ## Deployment

1. Build the project
2. Configure deployment platform settings
3. Deploy using your preferred method:

   ```bash
   npm run deploy
   ``` -->

<!-- ## Testing

Explain how to run tests:

```bash
npm test
``` -->

## Contributing

Instructions for potential contributors:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

<!-- ## License

This project is licensed under the [LICENSE NAME] - see the [LICENSE.md](LICENSE.md) file for details. -->

## Contact

- Brendan K. Schatzki
- Email: <bkschatzki@gmail.com>
- Project Link: <https://github.com/BKSchatzki/partyroombloom>
