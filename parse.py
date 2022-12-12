# convert webhook link to env file
link = input("Enter webhook link: ")
link = link.replace("https://discord.com/api/webhooks/", "")
link = link.replace("/", " ")
# remove the https://discord.com/api/webhooks/ part
link = link.split(" ")
# remove indexes 0 - 4
link = link[5:]
link = " ".join(link)
# remove the / part
link = link.split(" ")
with open('.env', 'w') as f:
    f.write("ID=" + link[0])
    f.write("\n")
    f.write("TOKEN=" + link[1])
    f.close()
print("Done!")