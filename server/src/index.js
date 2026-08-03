import './loadEnv.js';

import express from 'express';
import passport from 'passport';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath, pathToFileURL } from 'url';

import { startBookingCleanupJob } from './cleanupBookings.js';
import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import cinemasRouter from './routes/cinemas.js';
import moviesRouter from './routes/movies.js';
import movieSessionsRouter from './routes/movieSessions.js';
import settingsRouter from './routes/settings.js';
import usersRouter from './routes/users.js';
import { swaggerSpec } from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3022;

app.use(express.json());
app.use(passport.initialize());
app.use('/api', authRouter);
app.use('/api', moviesRouter);
app.use('/api', cinemasRouter);
app.use('/api', movieSessionsRouter);
app.use('/api', usersRouter);
app.use('/api', settingsRouter);
app.use('/api', bookingsRouter);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/static', express.static(path.join(__dirname, '../static')));

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    startBookingCleanupJob();
  });
}

export { app };
export default app;
