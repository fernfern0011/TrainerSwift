# TrainerSwift

Step to connect to Booking database
1. Create a file called 'database.ini' inside booking folder
2. Add following codes inside:
    [postgresql]
    host=host.docker.internal
    database=verceldb
    user=default
    password=<password_is_to_be_provided_in_the_setup_documentation>
    port=5432 
    