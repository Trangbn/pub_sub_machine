<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<h3 align="center">pub_sub_machine</h3>

  <p align="center">
    A project for pub-sub mechanism
  </p>
</div>

### Built With
    
* ExpressJS

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
