<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<h3 align="center">pub_sub_machine</h3>

  <p align="center">
    A project for pub-sub mechanism
  </p>
</div>

### Built With
    
* ExpressJS
* Redis

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* Redis
  ```sh
  docker run -d --restart unless-stopped -p 6379:6379  --name redisLocal  redis
  ```
  
<!-- USAGE EXAMPLES -->
## Usage

Handle incoming events: SALE_EVENT, REFILL_EVENT, LOW_STOCK_WARNING_EVENT, STOCK_LEVEL_OK_EVENT </br>
Endpoints to use:
 * GET: /machine: return shared array machines
 * POST /trigger-event-sale: trigger event sale by publishing name, machine </br>
    Body:
   ```sh
   {
    "eventType": "sale",
    "name":"machine 1",
    "machine": {
        "id": 1,
        "quantity": 98
       }
    }
    ```
 
 * POST /trigger-event-refill: refill quantity </br>
  Body:
   ```sh
   {
    "eventType": "refill",
    "name": "machine 1",
    "machine": {
        "id": 1,
        "quantity": 99
      }
    }
    ```
