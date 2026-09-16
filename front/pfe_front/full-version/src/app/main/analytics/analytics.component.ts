import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';

import { colors } from 'app/colors.const';
import { User } from 'app/auth/models';
import { UserService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import {Probleme} from "../../../models/probleme.model";
import {Incident} from "../../../models/incident.model";
import {ProblemeService} from "../../services/problem.service";
import {IncidentService} from "../../services/incident.service";
import Chart from "chart.js";
import {Changement} from "../../../models/changement.model";
import {ChangementService} from "../../services/changement.service";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnInit {

  problems: Probleme[] = [];
  changes: Changement[] = [];
  UnArchivedproblems: Probleme[] = [];
  incidents: Incident[] = [];
  UnArchivedincidents: Incident[] = [];
  totalProblems = 0;
  totalIncidents = 0;
  archivedProblems = 0;
  archivedIncidents = 0;
  TotalChangement = 0;
  AccepetedChangement = 0;
  HighPriotiyChangement = 0;

  constructor(private problemeService: ProblemeService,private incidentService: IncidentService,
              private changementService:ChangementService) {}

  ngOnInit(): void {
    this.loadStats();
    this.changementService.getAllChangements().subscribe((data: Changement[]) => {
      this.changes=data
      this.renderChangesPriorityChart();
      this.renderChangesStatsChart();
      this.TotalChangement = this.changes.length;
      this.AccepetedChangement = this.changes.filter(change => change.statutChangement === 'TERMINE').length;
      this.HighPriotiyChangement = this.changes.filter(change => change.priorite === 'HAUTE' || change.priorite === 'URGENTE').length;
    })
  }

  loadStats() {
    this.problemeService.getAllTypesProblemes().subscribe((data: Probleme[]) => {
      this.problems = data;
      this.totalProblems = data.length;
      this.archivedProblems = data.filter((p) => p.archived).length;
      this.renderProblemsStatusChart();
    });

    this.incidentService.getAllTypesIncidents().subscribe((data: Incident[]) => {
      this.incidents = data;
      this.totalIncidents = data.length;
      this.archivedIncidents = data.filter((i) => i.archived).length;
      this.renderIncidentsPriorityChart();
    });
    this.incidentService.getAllIncidents().subscribe((data: Incident[]) => this.UnArchivedincidents=data)
    this.problemeService.getAllProblemes().subscribe((data: Probleme[]) => this.UnArchivedproblems=data)

  }

  renderProblemsStatusChart() {
    const statuses = this.UnArchivedproblems.reduce((acc, problem) => {
      acc[problem.statutProbleme] = (acc[problem.statutProbleme] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statuses);
    const data = Object.values(statuses) as number[];

    new Chart('problemsStatusChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
    });
  }


  renderIncidentsPriorityChart() {
    const priorities = this.UnArchivedincidents.reduce((acc, incident) => {
      acc[incident.priorite] = (acc[incident.priorite] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(priorities);
    const data = Object.values(priorities) as number[];


    new Chart('incidentsPriorityChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Incident Priorities',
            data,
            backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
          },
        ],
      },
     options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
  }
},
});
  }

  renderChangesStatsChart() {
    const changesStats = this.changes.reduce((acc, change) => {
      acc[change.statutChangement] = (acc[change.statutChangement] || 0) + 1;
      return acc;
    }, {} as Record<string, number>); // Aggregates stats by status

    const labels = Object.keys(changesStats); // Status labels
    const data = Object.values(changesStats) as number[]; // Counts for each status

    new Chart('changesStatsChart', {
      type: 'doughnut', // Example: Doughnut chart
      data: {
        labels, // Change statuses
        datasets: [
          {
            label: 'Changes by Status',
            data, // Counts of each status
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colors for each segment
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  renderChangesPriorityChart() {
    const priorityStats = this.changes.reduce((acc, change) => {
      acc[change.priorite] = (acc[change.priorite] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(priorityStats); // Priority labels
    const data = Object.values(priorityStats) as number[]; // Counts for each priority

    new Chart('changesPriorityChart', {
      type: 'bar', // Example: Bar chart
      data: {
        labels, // Change priorities
        datasets: [
          {
            label: 'Changes by Priority',
            data, // Counts of each priority
            backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'], // Colors for bars
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
    });
  }



}