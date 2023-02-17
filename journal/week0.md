# Week 0 — Billing and Architecture

## Creating a budget using AWS CLI

### step 1

- Configure aws credentials for the IAM user on local server

### step 2

- Creating json files in a folder example aws/json/budget.json
- budget.json

```
{
	"BudgetLimit": {
		"Amount": "100",
		"Unit": "USD"
	},
	"BudgetName": "My Sample Budget",
	"BudgetType": "COST",
	"CostFilters": {
		"TagKeyValue": ["user:Key$value1", "user:Key$value2"]
	},
	"CostTypes": {
		"IncludeCredit": true,
		"IncludeDiscount": true,
		"IncludeOtherSubscription": true,
		"IncludeRecurring": true,
		"IncludeRefund": true,
		"IncludeSubscription": true,
		"IncludeSupport": true,
		"IncludeTax": true,
		"IncludeUpfront": true,
		"UseBlended": false
	},
	"TimePeriod": {
		"Start": 1477958399,
		"End": 3706473600
	},
	"TimeUnit": "MONTHLY"
}
```

- notifications-with-subscribers.json

```
[
	{
		"Notification": {
			"ComparisonOperator": "GREATER_THAN",
			"NotificationType": "ACTUAL",
			"Threshold": 80,
			"ThresholdType": "PERCENTAGE"
		},
		"Subscribers": [
			{
				"Address": "example@gmail.com",
				"SubscriptionType": "EMAIL"
			}
		]
	}
]
```

### step 3

- run the below command to create the budget

```
aws budgets create-budget \
    --account-id $ACCOUNT_ID \
    --budget file://aws/json/budget.json \
    --notifications-with-subscribers file://aws/json/notifications-with-subscribers.json
```

- final results
  ![This](/home/emmah/Downloads/MarcDownloads/marcrine-geek-aws-bootcamp-cruddur-2023/screenshots/Screenshot from 2023-02-16 23-44-42.png)
