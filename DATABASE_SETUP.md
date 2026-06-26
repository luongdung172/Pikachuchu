# Pikachuchu database setup

This update adds a `player_game_results` database table and two API endpoints:

- `POST /api/results` saves one finished game.
- `GET /api/results` returns the latest 100 saved games.

## Saved fields

Each finished game stores:

- player name
- difficulty key and difficulty label
- board rows, columns, and tile type count
- total pairs and cleared pairs
- number of helps used
- final score
- result: `WIN` or `LOSE`
- result reason: `PLAYER_WIN`, `TIME_UP`, or `AUTO_SOLVE`
- time limit, time left, play duration
- started time, finished time, created time

## Local development

By default the Spring Boot backend uses a local H2 file database:

```properties
jdbc:h2:file:./data/pikachuchu
```

After you run the backend once, the database files are created in:

```text
backend/data/
```

You can inspect the local database from:

```text
http://localhost:8080/h2-console
```

Use this JDBC URL:

```text
jdbc:h2:file:./data/pikachuchu
```

Username:

```text
sa
```

Password is empty.

## Production deployment

For real deployed data, do not rely on the local H2 file. Use a persistent PostgreSQL database such as Supabase, Neon, or Render PostgreSQL.

Set these environment variables on your backend hosting platform:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_HOST:5432/YOUR_DATABASE?sslmode=require
SPRING_DATASOURCE_USERNAME=YOUR_USERNAME
SPRING_DATASOURCE_PASSWORD=YOUR_PASSWORD
```

The backend will create/update the table automatically because `spring.jpa.hibernate.ddl-auto=update` is enabled.

## Frontend environment

Your frontend now supports either variable:

```text
VITE_API_ROOT=https://your-backend-domain.example.com
```

or the old one:

```text
VITE_API_BASE_URL=https://your-backend-domain.example.com/api/game
```

`VITE_API_ROOT` is cleaner because the result API is `/api/results`, not `/api/game`.
