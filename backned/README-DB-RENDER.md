Debugging MongoDB connection issues on Render

1) Ensure you set the `MONGODB_URI` environment variable in Render to your MongoDB Atlas (or other) connection string. Example:

   MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority

2) Make sure your Atlas cluster allows network access from Render (either set IP access list to `0.0.0.0/0` for quick testing or use VPC peering).

3) Check Render logs for repeated connection attempts and errors. The updated server logs connection attempts with retries and exponential backoff.

4) If you see `buffering timed out` errors, it means Mongoose attempted operations while not connected. With the new changes:
   - The server will not exit on initial DB failure; instead it logs retries and disables mongoose buffering if all retries fail.
   - Routes will return 503 when database isn't ready; check logs for `dbReadyState` and connection attempt messages.

5) To test locally before deploying, set the env var and run:

   $env:MONGODB_URI = "<your-uri>"; npm start

6) If using SRV URI (mongodb+srv), ensure DNS resolution is allowed from the host.

If you want, I can add an endpoint `/health` that reports DB readyState and service readiness for easier monitoring."