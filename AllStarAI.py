#!/usr/bin/env python
# coding: utf-8

# In[1]:


# import modules
import numpy as np 
import sys
from scipy import linalg
import mysql.connector


# In[2]:


# change to the appropriate user and password
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="nbavision"
)


# In[3]:


mycursor = mydb.cursor()

mycursor.execute("USE mydb;") # change to whatever database name you use

'''
PlayerName 0, PointsPerGame 1, AssistsPerGame 2, ReboundsPerGame 3, BlocksPerGame 4, StealsPerGame 5, \
ThreePointPercentage 6, MinutesPerGame 7, GamesPlayed 8, Height 9, Weight 10,  Position 11, \
PlayerEfficiency 12 Conference 13
'''

query = "SELECT Player.PlayerName, Player.PointsPerGame, Player.AssistsPerGame, Player.ReboundsPerGame, Player.BlocksPerGame, Player.StealsPerGame, Player.ThreePointPercentage, Player.MinutesPerGame, Player.GamesPlayed, Player.Height, Player.Weight,  Player.Position, Player.PlayerEfficiency, Team.Conference FROM Player JOIN Team ON Player.PlaysFor = Team.TeamName "

mycursor.execute(query)

myresult = mycursor.fetchall()


# In[12]:


# define helper functions
def count(arr,s):
    total = 0
    for elem in arr:
        if elem == s:
            total += 1
    return total 

def check_arr(arr):
    for i in arr:
        if i == False:
            return False
    return True


# In[6]:


#train the AI on all 5 positions

# make a and b matrices for all positions
pg_matrix = []
pg_pe = []
sg_matrix = []
sg_pe =[]
c_matrix = []
c_pe = []
pf_matrix = []
pf_pe =[]
sf_matrix = []
sf_pe = []



for row in myresult:
    '''factors: PointsPerGame 0, AssistsPerGame 1, ReboundsPerGame 2, BlocksPerGame 3, StealsPerGame 4,     ThreePointPercentage 5, MinutesPerGame 6, GamesPlayed 7, Height 8, Weight 9,  Position 10,     PlayerEfficiency 11 ''' 

    # else if any row   
    position = row[11]

    if position == "PG":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        pg_matrix.append(row[1:11])
        pg_pe.append(pe)

    if position == "SG":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        sg_matrix.append(row[1:11])
        sg_pe.append(pe)

    if position == "C":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        c_matrix.append(row[1:11])
        c_pe.append(pe)

    if position == "PF":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        pf_matrix.append(row[1:11])
        pf_pe.append(pe)

    if position == "SF":
        # a * x = b 
        # x = factors
        # b = player efficiency 
        # a = values in rows 
        pe = row[12]
        sf_matrix.append(row[1:11])
        sf_pe.append(pe)

solution_pg = linalg.lstsq(pg_matrix,pg_pe) [0]
solution_sg = linalg.lstsq(sg_matrix,sg_pe) [0]
solution_c = linalg.lstsq(c_matrix,c_pe) [0]
solution_pf = linalg.lstsq(pf_matrix,pf_pe) [0]
solution_sf = linalg.lstsq(sf_matrix,sf_pe) [0]


# In[18]:


def find_all_star_team(conference):
    max_pe_pg = -sys.maxsize
    best_pg = ''
    max_pe_sg = -sys.maxsize
    best_sg = ''
    max_pe_c = -sys.maxsize
    best_c = ''
    max_pe_pf = -sys.maxsize
    best_pf = ''
    max_pe_sf = -sys.maxsize
    best_sf = ''

    skip_list = set()

    finalized = [False,False,False,False,False]

    while( check_arr(finalized)  == False):

        if finalized[0] == False:
            max_pe_pg = -sys.maxsize
            best_pg = ''

        if finalized[1] == False: 
            max_pe_sg = -sys.maxsize
            best_sg = ''

        if finalized[2] == False:
            max_pe_c = -sys.maxsize
            best_c = ''

        if finalized[3] == False:
            max_pe_pf = -sys.maxsize
            best_pf = ''

        if finalized[4] == False:
            max_pe_sf = -sys.maxsize
            best_sf = ''


        first_row = True

        for row in myresult:
            
            #only consider a single conference
            if row[13] != conference:
                continue

            if row[0] in skip_list:
                continue

            factors = row[1:11] 

            new_pe_pg = 0
            new_pe_sg = 0
            new_pe_c = 0
            new_pe_pf = 0
            new_pe_sf = 0


            # dot product
            for i in range(len(factors)):
                new_pe_pg += float(factors[i]) * float(solution_pg[i])
                new_pe_sg += float(factors[i]) * float(solution_sg[i])
                new_pe_c += float(factors[i]) * float(solution_c[i])
                new_pe_pf += float(factors[i]) * float(solution_pf[i])
                new_pe_sf += float(factors[i]) * float(solution_sf[i])

            if new_pe_pg > max_pe_pg and finalized[0] == False:
                best_pg = row[0]
                max_pe_pg = new_pe_pg

            if new_pe_sg > max_pe_sg and finalized[1] == False:
                best_sg = row[0]
                max_pe_sg = new_pe_sg

            if new_pe_c > max_pe_c and finalized[2] == False:
                best_c = row[0]
                max_pe_c = new_pe_c

            if new_pe_pf > max_pe_pf and finalized[3] == False:
                best_pf = row[0]
                max_pe_pf = new_pe_pf

            if new_pe_sf > max_pe_sf and finalized[4] == False:
                best_sf = row[0]
                max_pe_sf = new_pe_sf

        # evaluate no two positions are taken by the same player
        # if they are: keep the player in the higher PE position and redo the algorithm for the other position

        all_star = [best_pg, best_sg, best_c, best_pf, best_sf]
        all_star_rating = [max_pe_pg, max_pe_sg, max_pe_c, max_pe_pf, max_pe_sf]
        Positions = ['Point Guard', 'Shooting Guard', 'Center', 'Power Forward', 'Small Forward']

        for i in range(len(all_star)):

            if count(all_star, all_star[i]) == 1:
                # found best player for that position
                finalized[i] = True
                skip_list.add(all_star[i])
            else:
                dupes = [i]
                for j in range(len(all_star)):
                    if i ==j:
                        continue
                    # if duplicates
                    if all_star[j] == all_star[i]:
                        dupes.append(j)

                best_fit_positon = dupes[0]
                best_fit_points = all_star_rating[dupes[0]]

                for k in dupes:
                    if all_star_rating[k] > best_fit_points:
                        best_fit_points = all_star_rating[k]
                        best_fit_positon = k



                finalized[best_fit_positon] = True
                skip_list.add(all_star[best_fit_positon])


    print("The best Point Guard in the NBA " + str(conference) +" conference is "+ str(best_pg) + " with a PE of "+ str(max_pe_pg))
    print("The best Shooting Guard in the NBA " + str(conference) +" conference is "+ str(best_sg) + " with a PE of "+ str(max_pe_sg))
    print("The best Center in the NBA " + str(conference) + " conference is "+ str(best_c) + " with a PE of "+ str(max_pe_c))
    print("The best Power Forward in the NBA " + str(conference) + " is "+ str(best_pf) + " with a PE of "+ str(max_pe_pf))
    print("The best Small Forward in the NBA " + str(conference) + " is "+ str(best_sf) + " with a PE of "+ str(max_pe_sf))


# In[8]:


def playerinNewPosition(name, position, position_soln):
    for row in myresult:
        if row[0] == name:

            factors = row[1:11] 
            new_pe = 0

            # dot product
            for i in range(len(factors)):
                new_pe += float(factors[i]) * float(position_soln[i])

            print("If " + str(name) + ' plays as a ' + str(position) + ' he is expected to have a PE of ' + str(new_pe) )
            return new_pe
    print("Player not found")
    return None


# In[9]:


print(playerinNewPosition('LeBron James', 'PG', solution_pg))


# In[19]:


find_all_star_team("East")
print()
find_all_star_team("West")


# In[ ]:




