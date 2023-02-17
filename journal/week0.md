# Week 0 — Billing and Architecture

## Creating a budget using AWS CLI

### step 1

- Install AWS CLI using the following steps

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

```
unzip awscliv2.zip
```

```
sudo ./aws/install
```

- Command to check aws cli installed version

```
aws --version
```

![This](/screenshots/img2.png)

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
  ![This](/screenshots/img1.png)

## Creating a billing alarm via cli

### step 1

- Creating an SNS topic for the alarm

```
aws sns create-topic --name billing-alarm
```

```
aws sns subscribe \
    --topic-arn TopicARN \
    --protocol email \
    --notification-endpoint email@example.com
```

### step 2

- Create json file alarm_config.json

```
{
    "AlarmName": "DailyEstimatedCharges",
    "AlarmDescription": "This alarm would be triggered if the daily estimated charges exceeds 100$",
    "ActionsEnabled": true,
    "AlarmActions": [
        "ARN"
    ],
    "EvaluationPeriods": 1,
    "DatapointsToAlarm": 1,
    "Threshold": 1,
    "ComparisonOperator": "GreaterThanOrEqualToThreshold",
    "TreatMissingData": "breaching",
    "Metrics": [{
        "Id": "m1",
        "MetricStat": {
            "Metric": {
                "Namespace": "AWS/Billing",
                "MetricName": "EstimatedCharges",
                "Dimensions": [{
                    "Name": "Currency",
                    "Value": "USD"
                }]
            },
            "Period": 86400,
            "Stat": "Maximum"
        },
        "ReturnData": false
    },
    {
        "Id": "e1",
        "Expression": "IF(RATE(m1)>0,RATE(m1)*86400,0)",
        "Label": "DailyEstimatedCharges",
        "ReturnData": true
    }]
  }
```

```

```

aws cloudwatch put-metric-alarm --cli-input-json file://aws/json/alarm_config.json

```

```

## Architectural diagram on lucid charts

- link
- https://lucid.app/lucidchart/688cc235-8f61-4e81-8d03-6f3b8ec2270f/edit?viewport_loc=-686%2C-144%2C3488%2C1544%2C0_0&invitationId=inv_72c01b82-6931-441c-9253-609cb4a8ecc3
