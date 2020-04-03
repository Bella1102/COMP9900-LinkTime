import datetime
def dateRange(beginDate, endDate):
    dates = []
    dt = datetime.datetime.strptime(beginDate, "%Y-%m-%d")
    date = beginDate[:]
    while date <= endDate:
        dates.append(date)
        dt = dt + datetime.timedelta(1)
        date = dt.strftime("%Y-%m-%d")
    return dates

a = dateRange('2020-04-02', '2020-04-15')
b = dateRange('2020-04-02', '2020-04-12')
for i in [item for item in a if not item in b]:
    print(i)